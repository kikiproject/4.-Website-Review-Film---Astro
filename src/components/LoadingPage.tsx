// Loading Page Component with GSAP animations
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingPageProps {
  onComplete?: () => void;
  minDuration?: number;
}

export default function LoadingPage({ onComplete, minDuration = 2000 }: LoadingPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading progress
    const startTime = Date.now();
    const interval = setInterval(() => {
      setProgress(prev => {
        const elapsed = Date.now() - startTime;
        const targetProgress = Math.min((elapsed / minDuration) * 100, 100);
        
        if (targetProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            onComplete?.();
          }, 300);
          return 100;
        }
        
        return Math.min(prev + Math.random() * 15, targetProgress);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-500 overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Gradient orbs */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500 rounded-full blur-[100px]"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500 rounded-full blur-[100px]"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-magenta-500 rounded-full blur-[150px]"
            />
          </div>

          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 260,
                damping: 20,
                duration: 0.8 
              }}
              className="relative mb-8"
            >
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-32 h-32"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    strokeDasharray="10 5"
                    className="opacity-50"
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1A2DE7" />
                      <stop offset="100%" stopColor="#8F29BC" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Logo */}
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-violet-500 rounded-3xl flex items-center justify-center shadow-glow transform-gpu">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-5xl font-display font-bold text-white"
                >
                  A
                </motion.span>
              </div>

              {/* Sparkle effects */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 60}%`,
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                  }}
                />
              ))}
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-primary-400 via-violet-400 to-magenta-400 bg-clip-text text-transparent">
                ASTRO
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-secondary-400 mb-8 text-center"
            >
              Website Review Film Indonesia
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '200px' }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="relative"
            >
              <div className="w-52 h-1.5 bg-dark-300 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 via-violet-500 to-magenta-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-secondary-500"
              >
                {Math.round(progress)}%
              </motion.span>
            </motion.div>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-10 flex items-center gap-2 text-secondary-400"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"
              />
              <span className="text-sm">Memuat pengalaman terbaik...</span>
            </motion.div>
          </div>

          {/* Film strip decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-20">
            <motion.div
              animate={{ x: [0, -200] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="flex gap-4"
            >
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-12 h-16 bg-dark-200 rounded flex-shrink-0 flex flex-col justify-between p-1">
                  <div className="w-full h-1 bg-dark-400 rounded" />
                  <div className="w-full h-8 bg-dark-300 rounded" />
                  <div className="w-full h-1 bg-dark-400 rounded" />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

// Smooth scroll reveal component
export function ScrollReveal({ 
  children, 
  delay = 0,
  direction = 'up',
  className = '' 
}: { 
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
