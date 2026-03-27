import { useState } from 'react';
import { type ZodObject, type ZodRawShape, type ZodTypeAny } from 'zod';

interface FormPreviewProps {
  schema: ZodObject<ZodRawShape> | null;
}

// ── field introspection ─────────────────────────────────────────────────────

type FieldDef = {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'unknown';
  options?: string[];
  optional: boolean;
};

function toLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function resolveField(key: string, raw: ZodTypeAny): FieldDef {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let def = raw.def as any;
  const optional = def.type === 'optional';

  if (optional) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    def = (def.innerType as ZodTypeAny).def as any;
  }

  const base: Omit<FieldDef, 'type' | 'options'> = {
    name: key,
    label: toLabel(key),
    optional,
  };

  switch (def.type as string) {
    case 'string':
      return { ...base, type: 'string' };
    case 'number':
      return { ...base, type: 'number' };
    case 'boolean':
      return { ...base, type: 'boolean' };
    case 'enum':
      return {
        ...base,
        type: 'enum',
        options: Object.keys(def.entries as Record<string, string>),
      };
    default:
      return { ...base, type: 'unknown' };
  }
}

// ── sub-components ───────────────────────────────────────────────────────────

function TextField({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const hasError = Boolean(error);
  const id = `field-${field.name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-zinc-500">
        {field.label}
        {field.optional && (
          <span className="ml-1 font-normal text-zinc-400">(optional)</span>
        )}
      </label>
      <input
        id={id}
        type={field.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.type === 'number' ? '0' : field.label}
        aria-invalid={hasError || undefined}
        className={`rounded-lg border px-3 py-2 text-sm transition-colors outline-none placeholder:text-zinc-400 ${
          hasError
            ? 'border-rose-200 bg-rose-50 text-rose-900 focus:border-rose-400'
            : 'border-zinc-200 bg-zinc-50 text-zinc-900 focus:border-zinc-400 focus:bg-white'
        }`}
      />
      {hasError && (
        <p className="flex items-center gap-1 text-xs text-rose-500">
          <span aria-hidden>✕</span>
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const hasError = Boolean(error);
  const id = `field-${field.name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-zinc-500">
        {field.label}
        {field.optional && (
          <span className="ml-1 font-normal text-zinc-400">(optional)</span>
        )}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={hasError || undefined}
        className={`rounded-lg border px-3 py-2 text-sm transition-colors outline-none ${
          hasError
            ? 'border-rose-200 bg-rose-50 text-rose-900 focus:border-rose-400'
            : 'border-zinc-200 bg-zinc-50 text-zinc-900 focus:border-zinc-400 focus:bg-white'
        }`}
      >
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="flex items-center gap-1 text-xs text-rose-500">
          <span aria-hidden>✕</span>
          {error}
        </p>
      )}
    </div>
  );
}

function BooleanField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
      <label className="text-sm text-zinc-700">
        {field.label}
        {field.optional && (
          <span className="ml-1 text-xs font-normal text-zinc-400">
            (optional)
          </span>
        )}
      </label>
      <button
        type="button"
        role="switch"
        aria-label={field.label}
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${value ? 'bg-zinc-900' : 'bg-zinc-300'}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}

// ── empty / feedback states ──────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-lg text-zinc-400">
        ✦
      </div>
      <p className="text-sm text-zinc-400">
        Select a preset or paste a schema, then click{' '}
        <span className="font-medium text-zinc-600">Visualize</span>
      </p>
    </div>
  );
}

function SuccessState({
  values,
  onReset,
}: {
  values: Record<string, unknown>;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
        ✓
      </div>
      <div>
        <p className="text-sm font-semibold text-green-800">Schema validated</p>
        <p className="mt-0.5 text-xs text-green-600">
          All fields passed Zod validation
        </p>
      </div>
      <pre className="max-h-44 w-full overflow-auto rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-left font-mono text-xs text-green-700">
        {JSON.stringify(values, null, 2)}
      </pre>
      <button
        type="button"
        onClick={onReset}
        className="text-xs text-zinc-400 underline-offset-2 hover:text-zinc-700 hover:underline"
      >
        Back to form
      </button>
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────

export function FormPreview({ schema }: FormPreviewProps) {
  if (!schema) return <EmptyState />;

  const shapeKey = Object.keys(schema.def.shape).join(',');
  return <FormFields key={shapeKey} schema={schema} />;
}

function buildDefaults(fields: FieldDef[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const field of fields) {
    defaults[field.name] =
      field.type === 'boolean'
        ? false
        : field.type === 'enum'
          ? (field.options?.[0] ?? '')
          : '';
  }
  return defaults;
}

function coerceForParse(
  fields: FieldDef[],
  values: Record<string, unknown>
): Record<string, unknown> {
  const coerced: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = values[field.name];
    coerced[field.name] =
      field.type === 'number' && raw !== ''
        ? Number(raw)
        : field.optional && raw === ''
          ? undefined
          : raw;
  }
  return coerced;
}

function FormFields({ schema }: { schema: ZodObject<ZodRawShape> }) {
  const fields = Object.entries(schema.def.shape).map(([key, raw]) =>
    resolveField(key, raw as ZodTypeAny)
  );

  const [values, setValues] = useState<Record<string, unknown>>(() =>
    buildDefaults(fields)
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = fields
    .filter((f) => !f.optional && (f.type === 'string' || f.type === 'number'))
    .every((f) => String(values[f.name] ?? '').trim() !== '');

  function setValue(key: string, val: unknown) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Required-field gate: z.string() accepts '' by default so we enforce
    // non-empty ourselves before handing off to safeParse.
    const requiredErrors: Record<string, string> = {};
    for (const field of fields) {
      if (!field.optional && (field.type === 'string' || field.type === 'number')) {
        if (String(values[field.name] ?? '').trim() === '') {
          requiredErrors[field.name] = 'This field is required';
        }
      }
    }
    if (Object.keys(requiredErrors).length > 0) {
      setFieldErrors(requiredErrors);
      return;
    }

    const coerced = coerceForParse(fields, values);
    const result = schema.safeParse(coerced);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (key && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SuccessState
        values={coerceForParse(fields, values)}
        onReset={() => setSubmitted(false)}
      />
    );
  }

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {fields.map((field) => {
          if (field.type === 'boolean') {
            return (
              <BooleanField
                key={field.name}
                field={field}
                value={(values[field.name] as boolean) ?? false}
                onChange={(v) => setValue(field.name, v)}
              />
            );
          }
          if (field.type === 'enum') {
            return (
              <SelectField
                key={field.name}
                field={field}
                value={(values[field.name] as string) ?? ''}
                error={fieldErrors[field.name]}
                onChange={(v) => setValue(field.name, v)}
              />
            );
          }
          return (
            <TextField
              key={field.name}
              field={field}
              value={(values[field.name] as string) ?? ''}
              error={fieldErrors[field.name]}
              onChange={(v) => setValue(field.name, v)}
            />
          );
        })}
      </div>

      <div className="shrink-0 border-t border-zinc-100 px-5 py-4">
        <div className="flex items-center justify-between">
          {errorCount > 0 ? (
            <p className="flex items-center gap-1.5 text-xs text-rose-500">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold"
                aria-hidden
              >
                !
              </span>
              {errorCount} field{errorCount > 1 ? 's' : ''} failed validation
            </p>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </form>
  );
}
