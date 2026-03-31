import { AnimatePresence, motion } from 'framer-motion';
import { FormPreview } from '../features/schema-visualizer';
import type { ZodObject, ZodRawShape } from 'zod';

interface FormPreviewPanelProps {
  schema: ZodObject<ZodRawShape> | null;
}

export function FormPreviewPanel({ schema }: FormPreviewPanelProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100 px-5 py-3">
        <span className="text-sm text-zinc-400" aria-hidden>
          ✦
        </span>
        <span className="text-sm font-semibold text-zinc-900">Form Preview</span>
        <AnimatePresence>
          {schema && (
            <motion.span
              key="field-count"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-500"
            >
              {Object.keys(schema.shape).length} fields
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <FormPreview schema={schema} />
    </div>
  );
}
