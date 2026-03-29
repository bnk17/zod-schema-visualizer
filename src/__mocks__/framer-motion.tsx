/* eslint-disable react-refresh/only-export-components */
/**
 * Framer-motion mock for vitest / jsdom.
 *
 * - motion.* components render as their HTML tag equivalents (no animations).
 * - AnimatePresence renders children directly, with no exit-hold behaviour.
 *
 * This lets component tests assert on DOM presence/absence synchronously,
 * without needing requestAnimationFrame flushing or fake timers.
 */
import * as React from 'react';

// Strip all framer-specific props so they don't leak onto DOM elements.
const FRAMER_PROPS = new Set([
  'initial',
  'animate',
  'exit',
  'variants',
  'transition',
  'whileTap',
  'whileHover',
  'whileFocus',
  'whileDrag',
  'whileInView',
  'layout',
  'layoutId',
  'drag',
  'dragConstraints',
  'onAnimationStart',
  'onAnimationComplete',
]);

function stripFramerProps(props: Record<string, unknown>) {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (!FRAMER_PROPS.has(k)) clean[k] = v;
  }
  return clean;
}

// Build motion.div, motion.button, motion.span, etc. on demand.
export const motion = new Proxy(
  {},
  {
    get(_target, tag: string) {
      return React.forwardRef<unknown, Record<string, unknown>>(
        ({ children, ...rest }, ref) =>
          React.createElement(
            tag,
            { ...stripFramerProps(rest), ref },
            children as React.ReactNode,
          ),
      );
    },
  },
) as Record<string, React.ForwardRefExoticComponent<React.PropsWithoutRef<Record<string, unknown>>>>;

export function AnimatePresence({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
