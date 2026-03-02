import { motion } from 'motion/react';
import { Star, Lock, Trophy } from 'lucide-react';
import { LEVELS } from './gameData';
import type { LevelConfig } from './types';

interface LevelSelectProps {
  playerName: string;
  progress: Record<number, number>; // levelId -> stars earned
  onSelectLevel: (level: LevelConfig) => void;
  onLeaderboard: () => void;
}

function StarDisplay({ count, max = 3, size = 10 }: { count: number; max?: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array(max).fill(0).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < count ? '#FFD84D' : 'transparent'}
          color={i < count ? '#FFD84D' : '#3D4E6B'}
        />
      ))}
    </div>
  );
}

export function LevelSelect({ playerName, progress, onSelectLevel, onLeaderboard }: LevelSelectProps) {
  const totalStars = Object.values(progress).reduce((a, b) => a + b, 0);
  const maxLevel = Math.max(1, ...Object.keys(progress).filter(k => (progress[parseInt(k)] || 0) > 0).map(Number)) + 1;

  return (
    <div className="flex flex-col h-full bg-[#0A0E1A]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="px-4 pt-8 pb-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1E2D4E' }}>
        <div>
          <p className="text-[#43D9BB] text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {'>_'} {playerName}
          </p>
          <h2 className="text-white mt-0.5" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Select Level
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: '#0F1629', border: '1px solid #1E2D4E' }}>
            <Star size={12} fill="#FFD84D" color="#FFD84D" />
            <span className="text-[#FFD84D] text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
              {totalStars}
            </span>
          </div>
          <button
            onClick={onLeaderboard}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#0F1629', border: '1px solid #1E2D4E' }}
          >
            <Trophy size={16} color="#6B7FA3" />
          </button>
        </div>
      </div>

      {/* Level grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'none' }}>
        <div className="grid grid-cols-5 gap-2.5">
          {LEVELS.map((level, i) => {
            const stars = progress[level.id] || 0;
            const isUnlocked = level.id === 1 || (progress[level.id - 1] || 0) > 0 || level.id <= maxLevel;
            const isCompleted = stars > 0;

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.015, type: 'spring', stiffness: 300, damping: 25 }}
                onClick={() => isUnlocked && onSelectLevel(level)}
                disabled={!isUnlocked}
                className="flex flex-col items-center gap-1 rounded-2xl py-2.5 px-1 relative"
                style={{
                  background: isCompleted
                    ? 'radial-gradient(circle, #0D2420, #071410)'
                    : isUnlocked
                    ? '#0F1629'
                    : '#0A0D17',
                  border: `1.5px solid ${
                    isCompleted ? '#43D9BB33' : isUnlocked ? '#1E2D4E' : '#151F35'
                  }`,
                  boxShadow: isCompleted ? '0 0 12px rgba(67,217,187,0.08)' : 'none',
                  opacity: isUnlocked ? 1 : 0.45,
                }}
              >
                {!isUnlocked ? (
                  <Lock size={14} color="#3D4E6B" />
                ) : (
                  <span className="text-white" style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: isCompleted ? '#43D9BB' : '#E8F0FE',
                  }}>
                    {level.id}
                  </span>
                )}
                {isUnlocked && <StarDisplay count={stars} size={8} />}
              </motion.button>
            );
          })}
        </div>

        {/* Row labels */}
        <div className="mt-6 flex flex-col gap-2">
          {[
            { range: '1–10', label: 'Onboarding', color: '#43D9BB' },
            { range: '11–20', label: 'Crunch Time', color: '#4DA3FF' },
            { range: '21–30', label: 'Release Panic', color: '#FF4D4F' },
          ].map(({ range, label, color }) => (
            <div key={range} className="flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full" style={{ background: color }}/>
              <span className="text-[#6B7FA3] text-xs">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color }}>Lv.{range}</span>
                {' '}— {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
