import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { parseSchemaText } from './features/schema-visualizer/parse-schema';
import { TypePanel } from './features/schema-visualizer/components/TypePanel';
import { AppHeader } from './components/AppHeader';
import { AppHero } from './components/AppHero';
import { AppFooter } from './components/AppFooter';
import { ModeToggle } from './components/ModeToggle';
import { LeftPanel } from './components/LeftPanel';
import { FormPreviewPanel } from './components/FormPreviewPanel';
import type { ZodObject, ZodRawShape } from 'zod';
import './App.css';

type Mode = 'builder' | 'paste' | 'generate';

function App() {
  const [mode, setMode] = useState<Mode>('builder');
  const [schemaText, setSchemaText] = useState('');
  const [parsedSchema, setParsedSchema] = useState<ZodObject<ZodRawShape> | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const parse = useCallback((text: string) => {
    const result = parseSchemaText(text);
    if (result.ok) {
      setParsedSchema(result.schema);
      setParseError(null);
    } else {
      setParsedSchema(null);
      setParseError(result.error);
    }
  }, []);

  function handlePresetSelect(schema: string) {
    setSchemaText(schema);
    parse(schema);
  }

  function handleGeneratedSchema(schema: string) {
    setSchemaText(schema);
    parse(schema);
    setMode('paste');
  }

  function handleModeSwitch(next: Mode) {
    setMode(next);
    setParsedSchema(null);
    setParseError(null);
    setSchemaText('');
    setTimeout(() => {
      leftPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 0);
  }

  return (
    <div className="flex min-h-svh flex-col bg-white text-zinc-900">
      <AppHeader />
      <AppHero />

      <ModeToggle mode={mode} onSwitch={handleModeSwitch} />

      <section className="mx-auto w-full max-w-7xl flex-1 px-8 pb-5">
        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          style={{ minHeight: '520px' }}
        >
          <div ref={leftPanelRef}>
            <LeftPanel
              mode={mode}
              schemaText={schemaText}
              parseError={parseError}
              onSchemaChange={(text) => { setSchemaText(text); parse(text); }}
              onVisualize={() => parse(schemaText)}
              onPresetSelect={handlePresetSelect}
              onSchemaGenerated={handleGeneratedSchema}
            />
          </div>
          <FormPreviewPanel schema={parsedSchema} />
        </div>
      </section>

      <AnimatePresence>
        {parsedSchema && <TypePanel schema={parsedSchema} />}
      </AnimatePresence>

      <AppFooter />
    </div>
  );
}

export default App;
