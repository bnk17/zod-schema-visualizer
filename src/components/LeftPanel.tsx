import { AnimatePresence, motion } from 'framer-motion';
import { SchemaInput, GeneratePanel } from '../features/schema-visualizer';
import { SchemaBuilder } from '../features/schema-visualizer/builder/components/SchemaBuilder';

type Mode = 'builder' | 'paste' | 'generate';

interface LeftPanelProps {
  mode: Mode;
  schemaText: string;
  parseError: string | null;
  onSchemaChange: (text: string) => void;
  onVisualize: () => void;
  onPresetSelect: (schema: string) => void;
  onSchemaGenerated: (schema: string) => void;
}

export function LeftPanel({
  mode,
  schemaText,
  parseError,
  onSchemaChange,
  onVisualize,
  onPresetSelect,
  onSchemaGenerated,
}: LeftPanelProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="h-full"
      >
        {mode === 'builder' ? (
          <SchemaBuilder onChange={onSchemaChange} />
        ) : mode === 'paste' ? (
          <SchemaInput
            value={schemaText}
            onChange={onSchemaChange}
            onVisualize={onVisualize}
            onPresetSelect={onPresetSelect}
            error={parseError}
          />
        ) : (
          <GeneratePanel onSchemaGenerated={onSchemaGenerated} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
