/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { TypePanel } from '../../features/schema-visualizer/components/TypePanel';

// jsdom does not implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// ── clipboard mock ─────────────────────────────────────────────────────────────
// jsdom does not implement navigator.clipboard; install a plain object so the
// component's `navigator.clipboard.writeText(...)` call succeeds, then spy on
// the method with vi.spyOn so call tracking works correctly.

const clipboardStub = { writeText: (text: string) => Promise.resolve(text) };

Object.defineProperty(navigator, 'clipboard', {
  value: clipboardStub,
  configurable: true,
  writable: true,
});

const writeTextSpy = vi.spyOn(clipboardStub, 'writeText').mockResolvedValue('');

beforeEach(() => {
  writeTextSpy.mockClear();
});

// ── schemas ────────────────────────────────────────────────────────────────────

const basicSchema = z.object({
  name: z.string(),
  email: z.string(),
});

// ── tests ──────────────────────────────────────────────────────────────────────

describe('TypePanel', () => {
  it('renders nothing when schema is null', () => {
    const { container } = render(<TypePanel schema={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the "TypeScript Type" heading when schema is provided', () => {
    render(<TypePanel schema={basicSchema} />);
    expect(screen.getByText('TypeScript Type')).toBeInTheDocument();
  });

  it('renders the z.infer badge', () => {
    render(<TypePanel schema={basicSchema} />);
    expect(screen.getByText('z.infer<typeof schema>')).toBeInTheDocument();
  });

  it('renders "type Schema =" in the pre block', () => {
    render(<TypePanel schema={basicSchema} />);
    const pre = document.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveTextContent('type');
    expect(pre).toHaveTextContent('Schema');
  });

  it('renders field names from the schema', () => {
    render(<TypePanel schema={basicSchema} />);
    const pre = document.querySelector('pre');
    expect(pre).toHaveTextContent('name');
    expect(pre).toHaveTextContent('email');
  });

  it('shows the "Copy type" button', () => {
    render(<TypePanel schema={basicSchema} />);
    expect(screen.getByRole('button', { name: /copy type/i })).toBeInTheDocument();
  });

  it('calls navigator.clipboard.writeText when the copy button is clicked', async () => {
    render(<TypePanel schema={basicSchema} />);
    // fireEvent bypasses userEvent's clipboard interception
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy type/i }))
    })
    expect(writeTextSpy).toHaveBeenCalledOnce();
    expect(writeTextSpy).toHaveBeenCalledWith(expect.stringContaining('type Schema ='));
  });

  it('changes button text to "Copied" after clicking', async () => {
    const user = userEvent.setup();
    render(<TypePanel schema={basicSchema} />);
    await user.click(screen.getByRole('button', { name: /copy type/i }));
    await act(async () => {});
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });
});
