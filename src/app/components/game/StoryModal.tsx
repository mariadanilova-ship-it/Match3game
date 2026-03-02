import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import type { LevelConfig } from './types';

interface StoryModalProps {
  level: LevelConfig;
  onStart: () => void;
  onClose: () => void;
}

export function StoryModal({ level, onStart, onClose }: StoryModalProps) {
  const objectivesBugColors: Record<number, { color: string; name: string }> = {
    0: { color: '#43D9BB', name: 'Minor' },
    1: { color: '#4DA3FF', name: 'Backend' },
    2: { color: '#FF4D4F', name: 'Critical' },
    3: { color: '#FFD84D', name: 'UX' },
    4: { color: '#A96CFF', name: 'Security' },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-end z-50"
        style={{ background: 'rgba(6,9,18,0.85)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          className="w-full rounded-t-3xl p-6 pb-8"
          style={{ background: '#0F1629', border: '1px solid #1E2D4E', borderBottom: 'none' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: '#1E2D4E' }}/>

          {/* Level badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg"
                style={{ background: '#1A2440', border: '1px solid #1E2D4E' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#43D9BB', fontSize: '0.75rem', fontWeight: 600 }}>
                  LV.{level.id}
                </span>
              </div>
              <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>
                {level.name}
              </span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: '#141D35', border: '1px solid #1E2D4E' }}>
              <X size={14} color="#6B7FA3" />
            </button>
          </div>

          {/* Story card */}
          <div className="rounded-2xl p-4 mb-5"
            style={{ background: '#141D35', border: '1px solid #1E2D4E' }}>
            <p className="text-[#43D9BB] text-xs mb-2"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              // {level.story.character} says:
            </p>
            <p className="text-[#B8C8E8]"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {level.story.text}
            </p>
          </div>

          {/* Objectives */}
          <div className="mb-5">
            <p className="text-[#6B7FA3] text-xs mb-3"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Mission Objectives
            </p>
            <div className="flex flex-wrap gap-2">
              {level.objectives.map((obj) => {
                const bugInfo = objectivesBugColors[obj.bugType];
                return (
                  <div key={obj.bugType}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background: '#0A0E1A', border: `1.5px solid ${bugInfo.color}33` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: bugInfo.color }}/>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: bugInfo.color, fontSize: '0.75rem', fontWeight: 600 }}>
                      {bugInfo.name}
                    </span>
                    <span className="text-[#6B7FA3] text-xs">×{obj.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#43D9BB]"/>
              <span className="text-[#6B7FA3] text-xs">{level.timeLimit}s time limit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFD84D]"/>
              <span className="text-[#6B7FA3] text-xs">{level.starThresholds[2].toLocaleString()} pts for ★★★</span>
            </div>
          </div>

          {/* Start button */}
          <motion.button
            onClick={onStart}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{
              background: '#FF4D4F',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'white',
              letterSpacing: '0.02em',
              boxShadow: '0 0 24px rgba(255,77,79,0.3)',
            }}
          >
            SQUASH BUGS <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
