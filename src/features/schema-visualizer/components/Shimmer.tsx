import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

export interface ShimmerProps {
  children: string;
  className?: string;
  duration?: number;
  spread?: number;
}

function ShimmerComponent({
  children,
  className = '',
  duration = 2,
  spread = 2,
}: ShimmerProps) {
  const dynamicSpread = useMemo(
    () => (children?.length ?? 0) * spread,
    [children, spread]
  );

  return (
    <motion.span
      animate={{ backgroundPosition: '0% center' }}
      initial={{ backgroundPosition: '100% center' }}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
      className={`inline-block bg-clip-text text-transparent bg-[length:250%_100%,auto] [background-repeat:no-repeat,padding-box] ${className}`}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: [
            'linear-gradient(90deg,#0000 calc(50% - var(--spread)),#7c3aed calc(50%),#0000 calc(50% + var(--spread)))',
            'linear-gradient(#a78bfa,#a78bfa)',
          ].join(','),
        } as CSSProperties
      }
    >
      {children}
    </motion.span>
  );
}

export const Shimmer = memo(ShimmerComponent);
