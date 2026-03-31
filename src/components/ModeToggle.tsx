import { motion } from 'framer-motion';

type Mode = 'builder' | 'paste' | 'generate';

const LABELS: Record<Mode, string> = {
  builder: 'Builder',
  paste: 'Paste schema',
  generate: 'AI Generate',
};

interface ModeToggleProps {
  mode: Mode;
  onSwitch: (mode: Mode) => void;
}

export function ModeToggle({ mode, onSwitch }: ModeToggleProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 pb-5">
      <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
        {(['builder', 'paste', 'generate'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onSwitch(m)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === m ? 'text-white' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {mode === m && (
              <motion.span
                layoutId="tab-bg"
                className={`absolute inset-0 rounded-full shadow-sm ${
                  m === 'generate' ? 'bg-violet-600' : 'bg-zinc-900'
                }`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
              />
            )}
            <span className="relative">{LABELS[m]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
