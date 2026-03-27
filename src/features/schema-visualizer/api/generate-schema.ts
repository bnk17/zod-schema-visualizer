export class GenerationError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'GenerationError';
  }
}

export async function streamSchemaGeneration(
  prompt: string,
  onChunk: (token: string) => void,
  signal: AbortSignal
): Promise<void> {
  const res = await fetch('/api/generate-schema', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!res.ok || !res.body) {
    let message = 'Generation failed';
    if (res.status === 429) message = 'Rate limit reached — please wait a moment.';
    else if (res.status === 413) message = 'Prompt too long.';
    throw new GenerationError(message, res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const token = parsed.choices?.[0]?.delta?.content;
        if (token) onChunk(token);
      } catch {
        // malformed SSE line — skip
      }
    }
  }
}
