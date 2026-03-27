import { useState } from 'react'
import type { ZodObject, ZodRawShape } from 'zod'
import { generateTsType } from '../generate-ts-type'

interface TypePanelProps {
  schema: ZodObject<ZodRawShape> | null
}

export function TypePanel({ schema }: TypePanelProps) {
  const [copied, setCopied] = useState(false)

  if (!schema) return null

  const typeStr = generateTsType(schema)

  function handleCopy() {
    void navigator.clipboard.writeText(typeStr).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 pb-16">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400" aria-hidden>
              &lt;/&gt;
            </span>
            <span className="text-sm font-semibold text-zinc-900">
              TypeScript Type
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-500">
              z.infer&lt;typeof schema&gt;
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 font-mono text-xs text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-900"
          >
            {copied ? (
              <>
                <span aria-hidden>✓</span> Copied
              </>
            ) : (
              <>
                <span aria-hidden>⎘</span> Copy type
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto px-5 py-4 font-mono text-sm leading-relaxed text-zinc-700">
          <TypeTokens source={typeStr} />
        </pre>
      </div>
    </div>
  )
}

// Minimal syntax colouring — no external lib needed.
// Tokens: keyword, primitive, string-literal, punctuation, identifier
function TypeTokens({ source }: { source: string }) {
  const tokens = tokenize(source)
  return (
    <>
      {tokens.map((tok, i) => (
        <span key={i} className={tokenClass(tok.kind)}>
          {tok.text}
        </span>
      ))}
    </>
  )
}

type TokenKind = 'keyword' | 'primitive' | 'literal' | 'punctuation' | 'plain'

interface Token {
  kind: TokenKind
  text: string
}

const KEYWORDS = new Set(['type', 'Schema'])
const PRIMITIVES = new Set(['string', 'number', 'boolean', 'unknown'])

function tokenClass(kind: TokenKind): string {
  switch (kind) {
    case 'keyword':
      return 'text-violet-600'
    case 'primitive':
      return 'text-sky-600'
    case 'literal':
      return 'text-amber-600'
    case 'punctuation':
      return 'text-zinc-400'
    default:
      return 'text-zinc-700'
  }
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < src.length) {
    // string literal  'value'
    if (src[i] === "'") {
      let j = i + 1
      while (j < src.length && src[j] !== "'") j++
      tokens.push({ kind: 'literal', text: src.slice(i, j + 1) })
      i = j + 1
      continue
    }

    // punctuation characters
    if ('{}|?:;=\n'.includes(src[i])) {
      tokens.push({ kind: 'punctuation', text: src[i] })
      i++
      continue
    }

    // whitespace — keep as plain
    if (src[i] === ' ') {
      tokens.push({ kind: 'plain', text: ' ' })
      i++
      continue
    }

    // word token
    if (/\w/.test(src[i])) {
      let j = i
      while (j < src.length && /\w/.test(src[j])) j++
      const word = src.slice(i, j)
      const kind: TokenKind = KEYWORDS.has(word)
        ? 'keyword'
        : PRIMITIVES.has(word)
          ? 'primitive'
          : 'plain'
      tokens.push({ kind, text: word })
      i = j
      continue
    }

    tokens.push({ kind: 'plain', text: src[i] })
    i++
  }

  return tokens
}
