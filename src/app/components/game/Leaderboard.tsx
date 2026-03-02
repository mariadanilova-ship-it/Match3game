import { motion } from 'motion/react';
import { ArrowLeft, Star, Trophy, Medal } from 'lucide-react';
import type { LeaderboardEntry } from './types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  playerName: string;
  onBack: () => void;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FFD84D, #F59E0B)' }}>
      <Trophy size={14} color="#0A0E1A" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #B8C8E8, #8896AA)' }}>
      <Medal size={14} color="#0A0E1A" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FF9867, #C44A1A)' }}>
      <Medal size={14} color="#0A0E1A" />
    </div>
  );
  return (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ background: '#141D35', border: '1px solid #1E2D4E' }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#6B7FA3', fontSize: '0.7rem', fontWeight: 600 }}>
        {rank}
      </span>
    </div>
  );
}

export function Leaderboard({ entries, playerName, onBack }: LeaderboardProps) {
  const allEntries = [...entries]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const playerEntry = allEntries.find(e => e.name === playerName);

  return (
    <div className="flex flex-col h-full bg-[#0A0E1A]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="px-4 pt-8 pb-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid #1E2D4E' }}>
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#0F1629', border: '1.5px solid #1E2D4E' }}>
          <ArrowLeft size={16} color="#6B7FA3" />
        </button>
        <div>
          <h2 className="text-white" style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Leaderboard
          </h2>
          <p className="text-[#6B7FA3] text-xs">Top Bug Hunters</p>
        </div>
        <div className="ml-auto">
          <Trophy size={20} color="#FFD84D" />
        </div>
      </div>

      {/* Player's position if they have a score */}
      {playerEntry && (
        <div className="mx-4 mt-3 p-3 rounded-2xl"
          style={{ background: 'rgba(67,217,187,0.08)', border: '1.5px solid rgba(67,217,187,0.3)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: '#43D9BB22', border: '1.5px solid #43D9BB55' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#43D9BB', fontSize: '0.7rem', fontWeight: 700 }}>
                #{playerEntry.rank}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-white" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {playerEntry.name}
                </span>
                <span className="text-[#43D9BB] text-xs px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(67,217,187,0.15)', fontSize: '0.6rem' }}>YOU</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Star size={9} fill="#FFD84D" color="#FFD84D" />
                <span className="text-[#FFD84D] text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {playerEntry.stars} stars
                </span>
              </div>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#E8F0FE', fontWeight: 700, fontSize: '0.95rem' }}>
              {playerEntry.score.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Entries list */}
      <div className="flex-1 overflow-y-auto px-4 py-3" style={{ scrollbarWidth: 'none' }}>
        {/* Column header */}
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-8"/>
          <div className="flex-1 text-[#3D4E6B] text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            PLAYER
          </div>
          <div className="text-[#3D4E6B] text-xs w-16 text-right" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            SCORE
          </div>
          <div className="text-[#3D4E6B] text-xs w-8 text-right" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            ★
          </div>
        </div>

        {allEntries.length === 0 ? (
          <div className="mt-8 rounded-2xl px-4 py-6 text-center"
            style={{ background: '#0F1629', border: '1.5px solid #1E2D4E' }}>
            <p className="text-[#E8F0FE]" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              No records yet
            </p>
            <p className="text-[#6B7FA3] text-xs mt-1">
              Finish a level to add your first score.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {allEntries.map((entry, i) => {
              const isPlayer = entry.name === playerName;
              return (
                <motion.div
                  key={`${entry.name}-${i}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl"
                  style={{
                    background: isPlayer
                      ? 'rgba(67,217,187,0.06)'
                      : entry.rank <= 3
                      ? '#0F1629'
                      : '#0A0D17',
                    border: `1.5px solid ${
                      isPlayer ? 'rgba(67,217,187,0.25)' : entry.rank <= 3 ? '#1E2D4E' : '#111826'
                    }`,
                  }}
                >
                  <RankBadge rank={entry.rank} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#E8F0FE] truncate"
                        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 600 }}>
                        {entry.name}
                      </span>
                      {isPlayer && (
                        <span className="text-[#43D9BB] flex-shrink-0"
                          style={{ fontSize: '0.6rem', fontWeight: 700 }}>YOU</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#6B7FA3] text-xs">
                        Lv.{entry.level}
                      </span>
                      <div className="flex gap-0.5">
                        {Array(Math.min(3, Math.round(entry.stars / Math.max(entry.level, 1)))).fill(0).map((_, si) => (
                          <Star key={si} size={7} fill="#FFD84D" color="#FFD84D" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right w-16">
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: entry.rank <= 3 ? '#FFD84D' : '#B8C8E8', fontSize: '0.8rem', fontWeight: 700 }}>
                      {entry.score.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-8 text-right">
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#FFD84D', fontSize: '0.75rem', fontWeight: 600 }}>
                      {entry.stars}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
