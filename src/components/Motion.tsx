import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, y = 18, className }) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ value, prefix = '', suffix = '', duration = 1300, className }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};
