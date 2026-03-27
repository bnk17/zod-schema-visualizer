import { useCallback, useEffect, useRef, useState } from 'react';
import { streamSchemaGeneration, GenerationError } from '../api/generate-schema';
import type { GenerationStatus } from '../types/generation';

export function useSchemaGeneration(): {
  status: GenerationStatus;
  generate: (prompt: string) => void;
  cancel: () => void;
} {
  const [status, setStatus] = useState<GenerationStatus>({ phase: 'idle' });
  const abortRef = useRef<AbortController | null>(null);
  const bufferRef = useRef('');
  const rafRef = useRef<number | null>(null);

  const flushBuffer = useCallback(() => {
    rafRef.current = null;
    const partial = bufferRef.current;
    setStatus({ phase: 'streaming', partial });
  }, []);

  const generate = useCallback(
    (prompt: string) => {
      abortRef.current?.abort();
      bufferRef.current = '';
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus({ phase: 'streaming', partial: '' });

      streamSchemaGeneration(
        prompt,
        (token) => {
          bufferRef.current += token;
          if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(flushBuffer);
          }
        },
        controller.signal
      )
        .then(() => {
          if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
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
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setStatus({ phase: 'idle' });
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { status, generate, cancel };
}
