import { useEffect, useRef, useState } from 'react'
import { ZOD_TYPES } from '../zod-options'
import type { ZodTypeName } from '../types'

interface TypeSelectPopupProps {
  onSelect: (type: ZodTypeName) => void
  onClose: () => void
}

export function TypeSelectPopup({ onSelect, onClose }: TypeSelectPopupProps) {
  const [cursor, setCursor] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setCursor(c => Math.min(c + 1, ZOD_TYPES.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setCursor(c => Math.max(c - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        onSelect(ZOD_TYPES[cursor].value)
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Select Zod type"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="absolute top-full left-0 z-50 mt-1 w-52 rounded-xl border border-zinc-200 bg-white py-1 shadow-xl focus:outline-none"
    >
      {ZOD_TYPES.map((type, i) => (
        <div
          key={type.value}
          role="option"
          aria-selected={i === cursor}
          onClick={() => onSelect(type.value)}
          onMouseEnter={() => setCursor(i)}
          className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors ${
            i === cursor
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          <span className="font-mono font-medium">{type.label}</span>
          <span className={`font-mono text-xs ${i === cursor ? 'text-zinc-400' : 'text-zinc-400'}`}>
            {type.hint}
          </span>
        </div>
      ))}

      <div className="border-t border-zinc-100 px-3 py-1.5">
        <span className="text-xs text-zinc-400">↑↓ navigate · Enter select · Esc close</span>
      </div>
    </div>
  )
}
