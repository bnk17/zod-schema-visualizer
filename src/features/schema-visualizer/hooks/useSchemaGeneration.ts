import { useCallback, useEffect, useRef, useState } from 'react';
import {
  streamSchemaGeneration,
  GenerationError,
} from '../api/generate-schema';
import type { GenerationStatus } from '../types/generation';
const FLUSH_INTERVAL_MS = 80;

export function useSchemaGeneration(): {
  status: GenerationStatus;
  generate: (prompt: string) => void;
  cancel: () => void;
} {
  const [status, setStatus] = useState<GenerationStatus>({ phase: 'idle' });
  const abortRef = useRef<AbortController | null>(null);
  const bufferRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushBuffer = useCallback(() => {
    timerRef.current = null;
    setStatus({ phase: 'streaming', partial: bufferRef.current });
  }, []);

  const generate = useCallback(
    (prompt: string) => {
      abortRef.current?.abort();
      bufferRef.current = '';
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus({ phase: 'loading' });

      streamSchemaGeneration(
        prompt,
        (token) => {
          bufferRef.current += token;
          if (timerRef.current === null) {
            timerRef.current = setTimeout(flushBuffer, FLUSH_INTERVAL_MS);
          }
        },
        controller.signal
      )
        .then(() => {
          if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          setStatus({ phase: 'done', schema: bufferRef.current });
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          const message =
            err instanceof GenerationError
              ? err.message
              : 'Something went wrong. Please try again.';
          setStatus({ phase: 'error', message });
        });
    },
    [flushBuffer]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setStatus({ phase: 'idle' });
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  return { status, generate, cancel };
}
