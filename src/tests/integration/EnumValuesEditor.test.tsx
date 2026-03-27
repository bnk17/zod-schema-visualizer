/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useRef, useState } from 'react';
import { EnumValuesEditor } from '../../features/schema-visualizer/builder/components/EnumValuesEditor';
import { FieldRow } from '../../features/schema-visualizer/builder/components/FieldRow';
import type { FieldDef } from '../../features/schema-visualizer/builder/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

interface EditorWrapperProps {
  initial?: string[];
  onChangeSpy?: (values: string[]) => void;
}

function EditorWrapper({ initial = [], onChangeSpy }: EditorWrapperProps) {
  const [values, setValues] = useState<string[]>(initial);
  const ref = useRef<HTMLInputElement>(null);
  function handleChange(next: string[]) {
    setValues(next);
    onChangeSpy?.(next);
  }
  return <EnumValuesEditor ref={ref} values={values} onChange={handleChange} />;
}

function makeField(overrides: Partial<FieldDef> = {}): FieldDef {
  return {
    id: 'test-id',
    name: 'status',
    type: 'enum',
    validators: [],
    enumValues: [],
    ...overrides,
  };
}

// ── EnumValuesEditor ──────────────────────────────────────────────────────────

describe('EnumValuesEditor', () => {
  it('renders input with placeholder when values is empty', () => {
    render(<EditorWrapper initial={[]} />);
    const input = screen.getByRole('textbox', { name: /add enum value/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'add values… (Enter or ,)');
  });

  it('Enter key commits the draft and adds a chip', async () => {
    const user = userEvent.setup();
    render(<EditorWrapper initial={[]} />);
    const input = screen.getByRole('textbox', { name: /add enum value/i });

    await user.type(input, 'admin{Enter}');

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('Comma key commits the draft and adds a chip', async () => {
    const user = userEvent.setup();
    render(<EditorWrapper initial={[]} />);
    const input = screen.getByRole('textbox', { name: /add enum value/i });

    await user.type(input, 'editor,');

    expect(screen.getByText('editor')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('duplicate value is not added', async () => {
    const spy = vi.fn();
    const user = userEvent.setup();
    render(<EditorWrapper initial={['admin']} onChangeSpy={spy} />);
    const input = screen.getByRole('textbox', { name: /add enum value/i });

    await user.type(input, 'admin{Enter}');

    // onChange should not have been called with a duplicate
    expect(spy).not.toHaveBeenCalled();
    // still only one chip
    const chips = screen.getAllByText('admin');
    expect(chips).toHaveLength(1);
  });

  it('Backspace on empty input removes the last chip', async () => {
    const user = userEvent.setup();
    render(<EditorWrapper initial={['admin', 'editor']} />);

    const input = screen.getByRole('textbox', { name: /add enum value/i });
    await user.click(input);
    await user.keyboard('{Backspace}');

    expect(screen.queryByText('editor')).not.toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('clicking × on a chip removes it', async () => {
    const user = userEvent.setup();
    render(<EditorWrapper initial={['admin', 'editor']} />);

    await user.click(screen.getByRole('button', { name: /remove admin/i }));

    expect(screen.queryByText('admin')).not.toBeInTheDocument();
    expect(screen.getByText('editor')).toBeInTheDocument();
  });

  it('blur commits in-progress draft', async () => {
    const user = userEvent.setup();
    render(<EditorWrapper initial={[]} />);
    const input = screen.getByRole('textbox', { name: /add enum value/i });

    await user.type(input, 'viewer');
    await user.tab(); // triggers blur

    expect(screen.getByText('viewer')).toBeInTheDocument();
  });
});

// ── FieldRow enum auto-focus ──────────────────────────────────────────────────

describe('FieldRow enum auto-focus', () => {
  it('enum input receives focus when type "enum" is selected', async () => {
    const user = userEvent.setup();
    const field = makeField({ type: null, enumValues: [] });

    function Wrapper() {
      const [f, setF] = useState<FieldDef>(field);
      return (
        <FieldRow
          field={f}
          onChange={setF}
          onRemove={() => {}}
          onAddNext={() => {}}
        />
      );
    }

    render(<Wrapper />);

    // Open the type popup
    await user.click(screen.getByRole('button', { name: /type/i }));

    // Click the 'enum' option in the listbox
    await user.click(screen.getByRole('option', { name: /enum/i }));

    // After setTimeout(0) resolves the enum input should have focus
    // userEvent flushes timers, so the input should be focused
    const enumInput = screen.getByRole('textbox', { name: /add enum value/i });
    expect(enumInput).toHaveFocus();
  });
});
