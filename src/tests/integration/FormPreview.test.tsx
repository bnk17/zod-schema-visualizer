import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { FormPreview } from '../../features/schema-visualizer/components/FormPreview';

// ── schemas ───────────────────────────────────────────────────────────────────

const stringSchema = z.object({
  username: z.string().min(1),
  bio: z.string().optional(),
});

const numberSchema = z.object({
  age: z.number().min(0),
});

const booleanSchema = z.object({
  active: z.boolean(),
});

const enumSchema = z.object({
  role: z.enum(['admin', 'editor', 'viewer']),
});

const dateSchema = z.object({
  birthday: z.date(),
  graduatedAt: z.date().optional(),
});

// ── 1. EmptyState ─────────────────────────────────────────────────────────────

describe('EmptyState', () => {
  it('renders when schema prop is null', () => {
    render(<FormPreview schema={null} />);
    expect(
      screen.getByText(/select a preset or paste a schema/i)
    ).toBeInTheDocument();
  });

  it('does not render a submit button when schema is null', () => {
    render(<FormPreview schema={null} />);
    expect(
      screen.queryByRole('button', { name: /submit/i })
    ).not.toBeInTheDocument();
  });
});

// ── 2. Field rendering ────────────────────────────────────────────────────────

describe('field rendering', () => {
  it('renders a text input for a string field', () => {
    render(<FormPreview schema={stringSchema} />);
    expect(screen.getByLabelText(/username/i)).toHaveAttribute('type', 'text');
  });

  it('renders a number input for a number field', () => {
    render(<FormPreview schema={numberSchema} />);
    expect(screen.getByLabelText(/age/i)).toHaveAttribute('type', 'number');
  });

  it('renders a toggle (switch) for a boolean field', () => {
    render(<FormPreview schema={booleanSchema} />);
    expect(screen.getByRole('switch', { name: /active/i })).toBeInTheDocument();
  });

  it('renders a select element for an enum field with all options', () => {
    render(<FormPreview schema={enumSchema} />);
    const select = screen.getByRole('combobox', { name: /role/i });
    expect(select).toBeInTheDocument();
    expect(
      within(select as HTMLSelectElement).getByRole('option', { name: 'admin' })
    ).toBeInTheDocument();
    expect(
      within(select as HTMLSelectElement).getByRole('option', {
        name: 'editor',
      })
    ).toBeInTheDocument();
    expect(
      within(select as HTMLSelectElement).getByRole('option', {
        name: 'viewer',
      })
    ).toBeInTheDocument();
  });

  it('labels optional fields with "(optional)"', () => {
    render(<FormPreview schema={stringSchema} />);
    expect(screen.getByText(/\(optional\)/i)).toBeInTheDocument();
  });

  it('renders a date input for a date field', () => {
    render(<FormPreview schema={dateSchema} />);
    expect(screen.getByLabelText(/birthday/i)).toHaveAttribute('type', 'date');
  });
});

// ── 3. Submit button is always enabled ────────────────────────────────────────

describe('Submit button', () => {
  it('is always enabled regardless of field values', () => {
    render(<FormPreview schema={stringSchema} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  it('is enabled immediately for boolean-only schemas', () => {
    render(<FormPreview schema={booleanSchema} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  it('is enabled immediately for enum-only schemas', () => {
    render(<FormPreview schema={enumSchema} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });
});

// ── 4. Submit → validation errors ────────────────────────────────────────────

describe('submit with invalid data shows errors', () => {
  it('shows an error message for a field that fails zod validation', async () => {
    const schema = z.object({
      name: z.string().min(3, 'Name is too short'),
    });
    const user = userEvent.setup();
    render(<FormPreview schema={schema} />);

    await user.type(screen.getByLabelText(/name/i), 'ab');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/name is too short/i)).toBeInTheDocument();
  });

  it('shows error messages under all failing fields', async () => {
    const schema = z.object({
      first: z.string().min(3, 'First is too short'),
      last: z.string().min(3, 'Last is too short'),
    });
    const user = userEvent.setup();
    render(<FormPreview schema={schema} />);

    // Type 2 chars into each — passes canSubmit gate, fails safeParse
    await user.type(screen.getByLabelText(/first/i), 'ab');
    await user.type(screen.getByLabelText(/last/i), 'cd');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/first is too short/i)).toBeInTheDocument();
    expect(screen.getByText(/last is too short/i)).toBeInTheDocument();
  });

  it('shows the error count badge in the footer when multiple fields fail', async () => {
    const schema = z.object({
      first: z.string().min(3, 'First is too short'),
      last: z.string().min(3, 'Last is too short'),
    });
    const user = userEvent.setup();
    render(<FormPreview schema={schema} />);

    await user.type(screen.getByLabelText(/first/i), 'ab');
    await user.type(screen.getByLabelText(/last/i), 'cd');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/2 fields failed validation/i)).toBeInTheDocument();
  });

  it('shows singular "field" in the badge for a single error', async () => {
    const schema = z.object({
      name: z.string().min(3, 'Name is too short'),
    });
    const user = userEvent.setup();
    render(<FormPreview schema={schema} />);

    await user.type(screen.getByLabelText(/name/i), 'ab');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/1 field failed validation/i)).toBeInTheDocument();
  });

  it('shows "required" error when submit is clicked with empty required fields', async () => {
    const schema = z.object({ name: z.string() });
    const user = userEvent.setup();
    render(<FormPreview schema={schema} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('does not reach success state when required fields are empty', async () => {
    const schema = z.object({ name: z.string() });
    const user = userEvent.setup();
    render(<FormPreview schema={schema} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.queryByText(/schema validated/i)).not.toBeInTheDocument();
  });
});

// ── 5. Error clears on edit ───────────────────────────────────────────────────

describe('error clears on edit', () => {
  it('clears a field error as soon as the user types into that field', async () => {
    const schema = z.object({ name: z.string().min(3, 'Too short') });
    const user = userEvent.setup();
    render(<FormPreview schema={schema} />);

    // Type 2 chars → passes canSubmit, fails safeParse
    await user.type(screen.getByLabelText(/name/i), 'ab');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/too short/i)).toBeInTheDocument();

    // Typing one more char should clear the error immediately
    await user.type(screen.getByLabelText(/name/i), 'c');
    expect(screen.queryByText(/too short/i)).not.toBeInTheDocument();
  });
});

// ── 6. Submit → SuccessState ──────────────────────────────────────────────────

describe('submit with valid data shows SuccessState', () => {
  it('renders the success panel with "Schema validated" heading', async () => {
    const user = userEvent.setup();
    render(<FormPreview schema={stringSchema} />);

    await user.type(screen.getByLabelText(/username/i), 'alice');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/schema validated/i)).toBeInTheDocument();
    expect(
      screen.getByText(/all fields passed zod validation/i)
    ).toBeInTheDocument();
  });

  it('renders the serialised JSON of submitted values in a pre block', async () => {
    const user = userEvent.setup();
    render(<FormPreview schema={stringSchema} />);

    await user.type(screen.getByLabelText(/username/i), 'alice');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // The pre block should contain the submitted value
    expect(screen.getByText(/"alice"/)).toBeInTheDocument();
  });

  it('renders a "Back to form" button in the success panel', async () => {
    const user = userEvent.setup();
    render(<FormPreview schema={stringSchema} />);

    await user.type(screen.getByLabelText(/username/i), 'alice');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      screen.getByRole('button', { name: /back to form/i })
    ).toBeInTheDocument();
  });
});

// ── 7. Date field ─────────────────────────────────────────────────────────────

describe('date field', () => {
  it('shows required error when a date field is left empty', async () => {
    const user = userEvent.setup();
    render(<FormPreview schema={dateSchema} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('reaches success state when a valid date is entered', async () => {
    const user = userEvent.setup();
    render(<FormPreview schema={dateSchema} />);

    await user.type(screen.getByLabelText(/birthday/i), '2000-06-15');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/schema validated/i)).toBeInTheDocument();
  });

  it('does not require the optional date field', async () => {
    const schema = z.object({ startDate: z.date().optional() });
    const user = userEvent.setup();
    render(<FormPreview schema={schema} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/schema validated/i)).toBeInTheDocument();
  });
});

// ── 8. Back to form ───────────────────────────────────────────────────────────

describe('Back to form', () => {
  it('clicking "Back to form" returns to the form view', async () => {
    const user = userEvent.setup();
    render(<FormPreview schema={stringSchema} />);

    await user.type(screen.getByLabelText(/username/i), 'alice');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/schema validated/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back to form/i }));

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.queryByText(/schema validated/i)).not.toBeInTheDocument();
  });
});
