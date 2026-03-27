export const config = { runtime: 'edge' };

declare const process: { env: Record<string, string | undefined> };

const SYSTEM_PROMPT = `You are a Zod schema code generator. Your only job is to output a single valid Zod schema expression.

Rules (follow strictly):
1. Output ONLY the raw z.object({...}) expression — no imports, no variable assignments, no markdown, no explanation.
2. The output must start with "z.object({" and end with "})".
3. Use only these Zod primitives: z.string(), z.number(), z.boolean(), z.enum([...]), z.date().
4. Supported validators: .min(), .max(), .email(), .url(), .int(), .positive(), .optional(), .length().
5. Do not use z.array(), z.union(), z.record(), z.infer, z.lazy, or any other Zod method not listed above.
6. Field names must be camelCase identifiers.
7. Enum values must be string literals in an array: z.enum(["value1", "value2"]).
8. Include 3 to 8 fields that make semantic sense for the described entity.
9. If the prompt is ambiguous or not about a data entity, generate a reasonable generic schema anyway.
10. Never output anything other than the schema expression. No "Here is...", no "\`\`\`", no newlines outside the expression.

Example output for "a product":
z.object({
  title: z.string().min(3).max(100),
  price: z.number().positive(),
  category: z.enum(["electronics", "clothing", "food", "books"]),
  stock: z.number().int().min(0),
  isAvailable: z.boolean(),
})`;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    });
  }

  const rawBody = await req.text();
  if (new TextEncoder().encode(rawBody).byteLength > 2048) {
    return new Response(JSON.stringify({ error: 'Request too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let prompt: string;
  try {
    const body = JSON.parse(rawBody) as { prompt?: unknown };
    if (typeof body.prompt !== 'string' || !body.prompt.trim()) {
      throw new Error('invalid');
    }
    prompt = body.prompt.trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const groqRes = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        stream: true,
        max_tokens: 512,
        temperature: 0.2,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      }),
    }
  );

  if (!groqRes.ok || !groqRes.body) {
    return new Response(JSON.stringify({ error: 'Upstream error' }), {
      status: groqRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(groqRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
