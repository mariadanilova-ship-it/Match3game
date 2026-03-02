import { motion } from 'motion/react';
import { Star, ChevronRight, LayoutGrid, RotateCcw } from 'lucide-react';
import type { LevelConfig, LevelResult } from './types';

interface LevelCompleteProps {
  level: LevelConfig;
  result: LevelResult;
  prevBestStars: number;
  onNext: () => void;
  onRetry: () => void;
  onLevelSelect: () => void;
}

function AnimatedStar({ delay, filled }: { delay: number; filled: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30, y: -20, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 250, damping: 18 }}
    >
      <motion.div
        animate={filled ? { filter: ['brightness(1)', 'brightness(1.8)', 'brightness(1)'] } : {}}
        transition={filled ? { delay: delay + 0.3, duration: 0.5 } : {}}
      >
        <Star
          size={44}
          fill={filled ? '#FFD84D' : 'transparent'}
          color={filled ? '#FFD84D' : '#2A3A5E'}
          strokeWidth={1.5}
        />
      </motion.div>
    </motion.div>
  );
}

export function LevelComplete({ level, result, prevBestStars, onNext, onRetry, onLevelSelect }: LevelCompleteProps) {
  const isNewRecord = result.stars > prevBestStars;
  const isFailed = result.stars === 0;

  const statusColors: Record<number, string> = {
    0: '#FF4D4F',
    1: '#6B7FA3',
    2: '#4DA3FF',
    3: '#FFD84D',
  };
  const statusText: Record<number, string> = {
    0: 'Bugs Survived',
    1: '✓ Bug Cleared',
    2: '⭐ Great Work!',
    3: '🏆 Perfect Run!',
  };

  return (
    <div className="flex flex-col items-center justify-between h-full bg-[#0A0E1A] px-6 py-10 relative overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: result.stars >= 3
            ? 'radial-gradient(ellipse at 50% 30%, rgba(255,216,77,0.06) 0%, transparent 70%)'
            : result.stars >= 2
            ? 'radial-gradient(ellipse at 50% 30%, rgba(77,163,255,0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(67,217,187,0.04) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(#43D9BB 1px, transparent 1px), linear-gradient(90deg, #43D9BB 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}/>

      {/* Top section */}
      <div className="flex flex-col items-center gap-6 relative z-10 w-full">
        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          {isNewRecord && !isFailed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
              style={{ background: 'rgba(255,216,77,0.15)', border: '1px solid rgba(255,216,77,0.4)' }}
            >
              <span style={{ color: '#FFD84D', fontSize: '0.7rem', fontWeight: 600 }}>NEW RECORD</span>
            </motion.div>
          )}
          <h2 className="text-white" style={{
            fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em',
            color: statusColors[result.stars],
          }}>
            {statusText[result.stars]}
          </h2>
          <p className="text-[#6B7FA3] text-sm mt-1">
            {isFailed ? 'Better luck next time' : `Level ${level.id} — ${level.name}`}
          </p>
        </motion.div>

        {/* Stars */}
        <div className="flex items-end gap-4 relative">
          <AnimatedStar delay={0.5} filled={result.stars >= 1} />
          <div style={{ marginBottom: 12 }}>
            <AnimatedStar delay={0.65} filled={result.stars >= 2} />
          </div>
          <AnimatedStar delay={0.8} filled={result.stars >= 3} />
        </div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full rounded-2xl p-5"
          style={{ background: '#0F1629', border: '1.5px solid #1E2D4E' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#6B7FA3] text-sm">Final Score</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1.6rem', color: '#E8F0FE' }}
            >
              {result.score.toLocaleString()}
            </motion.span>
          </div>

          {/* Star thresholds visual */}
          <div className="flex flex-col gap-2">
            {[
              { stars: 1, threshold: level.starThresholds[0] },
              { stars: 2, threshold: level.starThresholds[1] },
              { stars: 3, threshold: level.starThresholds[2] },
            ].map(({ stars: s, threshold }) => {
              const reached = result.score >= threshold;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array(s).fill(0).map((_, i) => (
                      <Star key={i} size={10} fill={reached ? '#FFD84D' : 'transparent'} color={reached ? '#FFD84D' : '#3D4E6B'} />
                    ))}
                    {Array(3 - s).fill(0).map((_, i) => (
                      <Star key={i + s} size={10} fill="transparent" color="#1E2D4E" />
                    ))}
                  </div>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: '#1E2D4E' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: reached ? '#FFD84D' : '#1E2D4E' }}
                      initial={{ width: 0 }}
                      animate={{ width: reached ? '100%' : `${Math.min(100, (result.score / threshold) * 100)}%` }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: reached ? '#FFD84D' : '#3D4E6B' }}>
                    {threshold.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="w-full flex flex-col gap-3 relative z-10"
      >
        {!isFailed && level.id < 30 && (
          <motion.button
            onClick={onNext}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{
              background: '#43D9BB',
              color: '#0A0E1A',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.02em',
            }}
          >
            NEXT LEVEL <ChevronRight size={18} />
          </motion.button>
        )}

        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: '#0F1629', border: '1.5px solid #1E2D4E', color: '#B8C8E8', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <RotateCcw size={15} /> Retry
          </button>
          <button
            onClick={onLevelSelect}
            className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: '#0F1629', border: '1.5px solid #1E2D4E', color: '#B8C8E8', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <LayoutGrid size={15} /> Levels
          </button>
        </div>
      </motion.div>
    </div>
  );
}
