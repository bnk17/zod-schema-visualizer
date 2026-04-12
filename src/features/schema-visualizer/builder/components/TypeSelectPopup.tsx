import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ZOD_TYPES } from '../zod-options'
import type { ZodTypeName } from '../types'

interface TypeSelectPopupProps {
  anchor: DOMRect
  onSelect: (type: ZodTypeName) => void
  onClose: () => void
}

const MOBILE_MQ = '(max-width: 767px)'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window.matchMedia === 'function'
      ? window.matchMedia(MOBILE_MQ).matches
      : false
  )
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(MOBILE_MQ)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export function TypeSelectPopup({ anchor, onSelect, onClose }: TypeSelectPopupProps) {
  const [cursor, setCursor] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

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

  const optionList = ZOD_TYPES.map((type, i) => (
    <div
      key={type.value}
      role="option"
      aria-selected={i === cursor}
      onClick={() => onSelect(type.value)}
      onMouseEnter={() => setCursor(i)}
      className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors ${
        i === cursor ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-50'
      }`}
    >
      <span className="font-mono font-medium">{type.label}</span>
      <span className={`font-mono text-xs ${i === cursor ? 'text-zinc-300' : 'text-zinc-400'}`}>
        {type.hint}
      </span>
    </div>
  ))

  // ── Shared backdrop ──────────────────────────────────────────────────────────
  // position:fixed so it escapes any overflow container. No portal needed —
  // keeping the element in the React tree means events work in tests.
  const backdrop = (
    <div
      className={`fixed inset-0 z-40 ${isMobile ? 'bg-black/40' : ''}`}
      onClick={onClose}
    />
  )

  // ── Mobile: bottom sheet ─────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {backdrop}
        <motion.div
          ref={containerRef}
          role="listbox"
          aria-label="Select Zod type"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-zinc-200 bg-white shadow-2xl focus:outline-none"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <div className="flex justify-center py-3">
            <div className="h-1 w-10 rounded-full bg-zinc-200" />
          </div>
          <p className="px-4 pb-2 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
            Select type
          </p>
          {optionList}
          <div className="border-t border-zinc-100 px-4 py-3">
            <span className="text-xs text-zinc-400">↑↓ navigate · Enter select · Esc close</span>
          </div>
        </motion.div>
      </>
    )
  }

  // ── Desktop: fixed dropdown anchored to the trigger button ───────────────────
  // position:fixed escapes overflow:auto/hidden ancestors without needing a portal.
  // Flips above the button when there isn't enough space below.
  const spaceBelow = window.innerHeight - anchor.bottom
  const dropdownHeight = ZOD_TYPES.length * 40 + 56
  const openAbove = spaceBelow < dropdownHeight

  const style: React.CSSProperties = openAbove
    ? { bottom: window.innerHeight - anchor.top + 4, left: anchor.left, width: 208 }
    : { top: anchor.bottom + 4, left: anchor.left, width: 208 }

  // Backdrop rendered after the listbox so jsdom's elementFromPoint (all elements
  // at position 0,0) finds the listbox option first in DOM order.
  return (
    <>
      <motion.div
        ref={containerRef}
        role="listbox"
        aria-label="Select Zod type"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={style}
        className="fixed z-50 rounded-xl border border-zinc-200 bg-white py-1 shadow-xl focus:outline-none"
        initial={{ opacity: 0, scale: 0.95, y: openAbove ? 4 : -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: openAbove ? 4 : -4 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      >
        {optionList}
        <div className="border-t border-zinc-100 px-3 py-1.5">
          <span className="text-xs text-zinc-400">↑↓ navigate · Enter select · Esc close</span>
        </div>
      </motion.div>
      {backdrop}
    </>
  )
}
