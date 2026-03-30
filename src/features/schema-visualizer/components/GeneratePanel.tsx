import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSchemaGeneration } from '../hooks/useSchemaGeneration';
import { Shimmer } from './Shimmer';
import { useState } from 'react';

const MAX_CHARS = 500;

const LOADING_MESSAGES = [
  'Reading your prompt…',
  'Thinking about the schema…',
  'Picking the right types…',
  'Almost there…',
];

interface GeneratePanelProps {
  onSchemaGenerated: (schema: string) => void;
}

export function GeneratePanel({ onSchemaGenerated }: GeneratePanelProps) {
  const [prompt, setPrompt] = useState('');
  const { status, generate, cancel } = useSchemaGeneration();
  const isBusy = status.phase === 'loading' || status.phase === 'streaming';

  const [messageIndex, setMessageIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isBusy) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = Math.min(idx + 1, LOADING_MESSAGES.length - 1);
      setMessageIndex(idx);
    }, 1200);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setMessageIndex(0);
    };
  }, [isBusy]);

  useEffect(() => {
    if (status.phase !== 'done') return;
    const schema = status.schema;
    const t = setTimeout(() => onSchemaGenerated(schema), 300);
    return () => clearTimeout(t);
  }, [status, onSchemaGenerated]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isBusy) return;
    generate(prompt);
  }

  const error = status.phase === 'error' ? status.message : null;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100 px-5 py-3">
        <span className="text-sm text-zinc-400" aria-hidden>
          ✦
        </span>
        <span className="text-sm font-semibold text-zinc-900">AI Generate</span>
        <span className="ml-auto rounded-full bg-violet-50 px-2 py-0.5 font-mono text-xs text-violet-500">
          Groq · Llama 3.3 70B
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        {/* Prompt textarea */}
        <div className="relative flex-1 px-5 pt-4">
          <textarea
            ref={textareaRef}
            className="h-full w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-zinc-900 outline-none placeholder:font-sans placeholder:text-zinc-300"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
            placeholder='Describe the schema you need — e.g. "a user profile with an optional avatar and a role enum"'
            spellCheck={false}
            aria-label="Schema generation prompt"
            disabled={isBusy}
          />
          <span className="absolute right-6 bottom-2 font-mono text-xs text-zinc-300 select-none">
            {prompt.length}/{MAX_CHARS}
          </span>
        </div>

        {/* Loading / streaming shimmer */}
        <AnimatePresence>
          {isBusy && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-5 mb-3 overflow-hidden rounded-xl border border-violet-100 bg-violet-50 px-4 py-3"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm"
                >
                  <Shimmer duration={1.6} spread={3}>
                    {LOADING_MESSAGES[messageIndex]}
                  </Shimmer>
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom toolbar */}
        <div className="shrink-0 border-t border-zinc-100 px-4 pt-3 pb-4">
          <div className="flex min-h-8 items-center justify-between gap-3">
            {error ? (
              <p className="text-xs text-red-500" role="alert">
                {error}
              </p>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              {isBusy && (
                <button
                  type="button"
                  onClick={cancel}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900"
                >
                  Stop
                </button>
              )}
              <button
                type="submit"
                disabled={!prompt.trim() || isBusy}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isBusy ? (
                  <>
                    <svg
                      className="h-3.5 w-3.5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <span aria-hidden>✦</span>
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
