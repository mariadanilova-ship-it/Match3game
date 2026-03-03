import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowLeft } from 'lucide-react';
import type { LevelConfig, LevelResult, Cell, Position, PowerUpType } from './types';
import { BUG_TYPES, POWER_UPS, getInitialPowerUpCharges } from './gameData';
import {
  createInitialBoard, findMatches, applyGravity, fillBoard,
  hasValidMoves, countBugTypes, removeMostCommonBug, generateId, BOARD_COLS,
} from './gameLogic';
import { BugIcon } from './BugIcon';

const TILE_SIZE = 56;
const GAP = 4;

const TILE_STYLES = [
  { bg: '#071A16', border: '#43D9BB', glow: 'rgba(67,217,187,0.48)' },
  { bg: '#07111E', border: '#4DA3FF', glow: 'rgba(77,163,255,0.48)' },
  { bg: '#1A0707', border: '#FF4D4F', glow: 'rgba(255,77,79,0.5)' },
  { bg: '#1A1507', border: '#FFD84D', glow: 'rgba(255,216,77,0.48)' },
  { bg: '#0F071A', border: '#A96CFF', glow: 'rgba(169,108,255,0.48)' },
];

// Circular Timer
function CircularTimer({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const progress = Math.max(0, timeLeft / totalTime);
  const offset = circ * (1 - progress);
  const color = progress > 0.5 ? '#43D9BB' : progress > 0.25 ? '#FFD84D' : '#FF4D4F';
  const critical = timeLeft <= 10 && timeLeft > 0;

  return (
    <motion.div
      className="relative"
      style={{ width: 64, height: 64 }}
      animate={critical ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={critical ? { duration: 0.8, repeat: Infinity } : {}}
    >
      <svg width={64} height={64} style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} stroke="#1E2D4E" strokeWidth="4" fill="none"/>
        <circle
          cx="32" cy="32" r={r}
          stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          fontSize: timeLeft >= 100 ? '0.75rem' : '0.95rem',
          color: color,
        }}>
          {timeLeft}
        </span>
      </div>
      {critical && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 16px ${color}` }}
          animate={{ opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// Star progress bar
function StarProgress({ score, thresholds }: { score: number; thresholds: [number, number, number] }) {
  const stars = score >= thresholds[2] ? 3 : score >= thresholds[1] ? 2 : score >= thresholds[0] ? 1 : 0;
  const nextThreshold = thresholds[stars] ?? thresholds[2];
  const prevThreshold = stars > 0 ? thresholds[stars - 1] : 0;
  const progress = stars >= 3 ? 1 : Math.min(1, (score - prevThreshold) / (nextThreshold - prevThreshold));

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          animate={i < stars ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={i < stars ? { duration: 0.3 } : {}}
        >
          <Star size={16}
            fill={i < stars ? '#FFD84D' : 'transparent'}
            color={i < stars ? '#FFD84D' : '#3D4E6B'}
          />
        </motion.div>
      ))}
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1E2D4E', minWidth: 40 }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: stars >= 2 ? '#FFD84D' : '#43D9BB' }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

// Objectives tracker
function ObjectivesBar({ objectives, levelConfig }: {
  objectives: Record<number, number>;
  levelConfig: LevelConfig;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {levelConfig.objectives.map((obj) => {
        const collected = objectives[obj.bugType] || 0;
        const done = collected >= obj.count;
        const pct = Math.min(1, collected / obj.count);
        const bug = BUG_TYPES[obj.bugType];
        return (
          <div key={obj.bugType}
            className="flex-1 min-w-[60px] flex flex-col gap-1 px-2 py-1.5 rounded-xl"
            style={{
              background: done ? `${bug.darkBg}CC` : '#0F1629',
              border: `1.5px solid ${done ? bug.color + '66' : '#1E2D4E'}`,
              boxShadow: done ? `0 0 8px ${bug.color}22` : 'none',
            }}
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm overflow-hidden flex items-center justify-center"
                  style={{ background: bug.darkBg }}>
                  <BugIcon type={obj.bugType} size={12} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: bug.color, fontSize: '0.65rem', fontWeight: 600 }}>
                  {bug.name}
                </span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: done ? bug.color : '#6B7FA3', fontSize: '0.65rem' }}>
                {collected}/{obj.count}
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1E2D4E' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: bug.color }}
                animate={{ width: `${pct * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Power-up bar
function PowerUpBar({ charges, onUse, firewallActive }: {
  charges: Record<string, number>;
  onUse: (type: PowerUpType) => void;
  firewallActive: boolean;
}) {
  return (
    <div className="flex gap-2">
      {POWER_UPS.map((pu) => {
        const count = charges[pu.type] || 0;
        const isFirewallActive = pu.type === 'firewall' && firewallActive;
        return (
          <motion.button
            key={pu.type}
            onClick={() => count > 0 && onUse(pu.type)}
            whileTap={count > 0 ? { scale: 0.92 } : {}}
            disabled={count === 0}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all"
            style={{
              background: isFirewallActive
                ? `${pu.color}22`
                : count > 0 ? '#0F1629' : '#0A0D17',
              border: `1.5px solid ${isFirewallActive ? pu.color + '88' : count > 0 ? '#1E2D4E' : '#0F1726'}`,
              opacity: count === 0 ? 0.4 : 1,
              boxShadow: isFirewallActive ? `0 0 12px ${pu.color}33` : 'none',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{pu.icon}</span>
            <span style={{ fontFamily: 'Inter, sans-serif', color: count > 0 ? '#B8C8E8' : '#3D4E6B', fontSize: '0.55rem', fontWeight: 600 }}>
              {pu.name.split(' ')[0]}
            </span>
            <div className="flex gap-0.5">
              {Array(Math.max(0, count)).fill(0).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full" style={{ background: pu.color }}/>
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

interface GameScreenProps {
  levelConfig: LevelConfig;
  playerName: string;
  onComplete: (result: LevelResult) => void;
  onBack: () => void;
}

export function GameScreen({ levelConfig, playerName, onComplete, onBack }: GameScreenProps) {
  const [board, setBoard] = useState<Cell[][]>(() => createInitialBoard(5));
  const [selected, setSelected] = useState<Position | null>(null);
  const [timeLeft, setTimeLeft] = useState(levelConfig.timeLimit);
  const [score, setScore] = useState(0);
  const [objectives, setObjectives] = useState<Record<number, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [powerUpCharges, setPowerUpCharges] = useState<Record<string, number>>(
    getInitialPowerUpCharges(levelConfig.id)
  );
  const [firewallActive, setFirewallActive] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'complete' | 'failed'>('playing');
  const [matchedCells, setMatchedCells] = useState<Set<string>>(new Set());
  const [comboText, setComboText] = useState<{ value: number; key: number } | null>(null);
  const [powerUpFeedback, setPowerUpFeedback] = useState<string | null>(null);
  const firewallRef = useRef(false);
  const comboRef = useRef(0);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); setPhase('failed'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Check objectives
  useEffect(() => {
    if (phase !== 'playing') return;
    const allMet = levelConfig.objectives.every(
      obj => (objectives[obj.bugType] || 0) >= obj.count
    );
    if (allMet) {
      setPhase('complete');
      const totalRequired = levelConfig.objectives.reduce((a, o) => a + o.count, 0);
      const bonus = Math.floor(timeLeft * 5 + totalRequired * 2);
      const finalScore = score + bonus;
      const stars = finalScore >= levelConfig.starThresholds[2] ? 3
        : finalScore >= levelConfig.starThresholds[1] ? 2 : 1;
      setTimeout(() => onComplete({ score: finalScore, stars }), 600);
    }
  }, [objectives]);

  useEffect(() => {
    if (phase === 'failed') {
      setTimeout(() => onComplete({ score, stars: 0 }), 600);
    }
  }, [phase]);

  const processMatches = useCallback(async (currentBoard: Cell[][], currentCombo: number) => {
    const matches = findMatches(currentBoard);
    if (matches.length === 0) {
      comboRef.current = 0;
      setIsProcessing(false);
      // Check valid moves
      if (!hasValidMoves(currentBoard)) {
        const newBoard = createInitialBoard(5);
        setBoard(newBoard);
        setPowerUpFeedback('No moves! Board reshuffled');
        setTimeout(() => setPowerUpFeedback(null), 2000);
      }
      return;
    }

    // Mark matches
    const matchSet = new Set(matches.map(p => `${p.row},${p.col}`));
    setMatchedCells(matchSet);

    // Count bugs
    const bugCounts = countBugTypes(matches, currentBoard);

    // Score calculation
    const multiplier = firewallRef.current ? 2 : 1;
    const comboMult = Math.max(1, currentCombo);
    const basePoints = matches.length >= 5 ? matches.length * 15 : matches.length >= 4 ? matches.length * 12 : matches.length * 10;
    const gained = basePoints * comboMult * multiplier;
    setScore(s => s + gained);

    // Combo display
    if (currentCombo > 1) {
      setComboText({ value: currentCombo, key: Date.now() });
      setTimeout(() => setComboText(null), 900);
    }

    // Update objectives
    setObjectives(prev => {
      const updated = { ...prev };
      Object.entries(bugCounts).forEach(([type, count]) => {
        updated[parseInt(type)] = (updated[parseInt(type)] || 0) + count;
      });
      return updated;
    });

    // Animate removal then fill
    await new Promise(res => setTimeout(res, 380));

    setMatchedCells(new Set());

    // Apply gravity and fill
    let newBoard = currentBoard.map(r => [...r]);
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = { type: -1, id: generateId() };
    });
    newBoard = applyGravity(newBoard);
    newBoard = fillBoard(newBoard, 5);
    setBoard(newBoard);
    comboRef.current = currentCombo + 1;

    // Check for cascade
    await new Promise(res => setTimeout(res, 200));
    processMatches(newBoard, currentCombo + 1);
  }, []);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (isProcessing || phase !== 'playing') return;

    if (!selected) {
      setSelected({ row, col });
      return;
    }

    if (selected.row === row && selected.col === col) {
      setSelected(null);
      return;
    }

    const rowDiff = Math.abs(selected.row - row);
    const colDiff = Math.abs(selected.col - col);

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      // Try swap
      const newBoard = board.map(r => [...r]);
      const tmp = newBoard[selected.row][selected.col];
      newBoard[selected.row][selected.col] = newBoard[row][col];
      newBoard[row][col] = tmp;

      const matches = findMatches(newBoard);
      if (matches.length > 0) {
        setIsProcessing(true);
        setBoard(newBoard);
        setSelected(null);
        comboRef.current = 1;
        setTimeout(() => processMatches(newBoard, 1), 200);
      } else {
        // Shake — no valid swap
        setSelected(null);
      }
    } else {
      // Select new tile instead
      setSelected({ row, col });
    }
  }, [isProcessing, phase, selected, board, processMatches]);

  const handlePowerUp = useCallback((type: PowerUpType) => {
    if ((powerUpCharges[type] || 0) <= 0) return;
    setPowerUpCharges(prev => ({ ...prev, [type]: (prev[type] || 0) - 1 }));

    if (type === 'freeze') {
      setTimeLeft(t => Math.min(t + 15, levelConfig.timeLimit));
      setPowerUpFeedback('❄️ +15 seconds!');
      setTimeout(() => setPowerUpFeedback(null), 1800);
    }

    if (type === 'hotfix') {
      const { newBoard, bugType, count } = removeMostCommonBug(board);
      const bug = BUG_TYPES[bugType];
      const bugCounts: Record<number, number> = { [bugType]: count };
      setObjectives(prev => {
        const updated = { ...prev };
        Object.entries(bugCounts).forEach(([t, c]) => {
          updated[parseInt(t)] = (updated[parseInt(t)] || 0) + c;
        });
        return updated;
      });
      setScore(s => s + count * 8);
      const gravity = applyGravity(newBoard);
      const filled = fillBoard(gravity, 5);
      setBoard(filled);
      setPowerUpFeedback(`🔧 Cleared ${count} ${bug.name} bugs!`);
      setTimeout(() => setPowerUpFeedback(null), 2000);
    }

    if (type === 'refactor') {
      const newBoard = createInitialBoard(5);
      setBoard(newBoard);
      setSelected(null);
      setPowerUpFeedback('♻️ Board refactored!');
      setTimeout(() => setPowerUpFeedback(null), 1800);
    }

    if (type === 'firewall') {
      firewallRef.current = true;
      setFirewallActive(true);
      setPowerUpFeedback('🛡️ 2× score active!');
      setTimeout(() => {
        firewallRef.current = false;
        setFirewallActive(false);
        setPowerUpFeedback(null);
      }, 8000);
    }
  }, [powerUpCharges, board, levelConfig.timeLimit]);

  const stars = score >= levelConfig.starThresholds[2] ? 3
    : score >= levelConfig.starThresholds[1] ? 2
    : score >= levelConfig.starThresholds[0] ? 1 : 0;

  const gridWidth = BOARD_COLS * TILE_SIZE + (BOARD_COLS - 1) * GAP;

  return (
    <div className="flex flex-col h-full bg-[#0A0E1A] relative overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(#43D9BB 1px, transparent 1px), linear-gradient(90deg, #43D9BB 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}/>

      {/* HUD Top */}
      <div className="relative z-10 px-4 pt-6 pb-3 flex items-center justify-between gap-3"
        style={{ borderBottom: '1px solid #1E2D4E11' }}>
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: '#0F1629', border: '1px solid #1E2D4E' }}>
          <ArrowLeft size={15} color="#6B7FA3" />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#43D9BB', fontSize: '0.65rem' }}>
              LV.{levelConfig.id}
            </span>
            <span className="text-[#6B7FA3]" style={{ fontSize: '0.65rem' }}>—</span>
            <span className="text-[#E8F0FE]" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
              {levelConfig.name}
            </span>
          </div>
          <StarProgress score={score} thresholds={levelConfig.starThresholds} />
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[#6B7FA3]" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem' }}>
            {playerName}
          </span>
          <span className="text-white" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 700 }}>
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Timer row */}
      <div className="relative z-10 px-4 py-2 flex items-center justify-between gap-3">
        <CircularTimer timeLeft={timeLeft} totalTime={levelConfig.timeLimit} />

        <div className="flex-1 flex flex-col gap-1">
          <ObjectivesBar objectives={objectives} levelConfig={levelConfig} />
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Combo text */}
          <AnimatePresence>
            {comboText && (
              <motion.div
                key={comboText.key}
                initial={{ scale: 0.5, opacity: 0, y: 0 }}
                animate={{ scale: 1.2, opacity: 1, y: -20 }}
                exit={{ scale: 0.8, opacity: 0, y: -40 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                style={{ zIndex: 100 }}
              >
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                  color: '#FFD84D',
                  textShadow: '0 0 20px rgba(255,216,77,0.6)',
                  letterSpacing: '-0.02em',
                }}>
                  {comboText.value}× COMBO!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Power-up feedback */}
          <AnimatePresence>
            {powerUpFeedback && (
              <motion.div
                key={powerUpFeedback}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -top-7 left-0 right-0 flex justify-center z-20 pointer-events-none"
              >
                <span className="px-3 py-1 rounded-lg text-xs text-white"
                  style={{ background: 'rgba(14,22,48,0.95)', border: '1px solid #1E2D4E', fontFamily: 'Inter, sans-serif' }}>
                  {powerUpFeedback}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#080C18',
              border: '1.5px solid #1A2540',
              boxSizing: 'content-box',
              boxShadow: '0 0 40px rgba(0,0,0,0.4)',
              width: gridWidth,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${BOARD_COLS}, ${TILE_SIZE}px)`,
                gap: `${GAP}px`,
              }}
            >
              {board.map((row, ri) =>
                row.map((cell, ci) => {
                  const isSelected = selected?.row === ri && selected?.col === ci;
                  const isMatched = matchedCells.has(`${ri},${ci}`);
                  const ts = TILE_STYLES[cell.type] || TILE_STYLES[0];

                  return (
                    <motion.button
                      key={cell.id}
                      onClick={() => handleTileClick(ri, ci)}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        isMatched
                          ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] }
                          : { scale: 1, opacity: 1 }
                      }
                      transition={
                        isMatched
                          ? { duration: 0.35, times: [0, 0.3, 1] }
                          : { type: 'spring', stiffness: 400, damping: 25, delay: (ri * BOARD_COLS + ci) * 0.004 }
                      }
                      whileTap={!isProcessing ? { scale: 0.88 } : {}}
                      className="flex items-center justify-center rounded-xl relative overflow-hidden"
                      style={{
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        background: ts.bg,
                        border: `1.5px solid ${isSelected ? ts.border : ts.border + '44'}`,
                        boxShadow: isSelected
                          ? `0 0 16px ${ts.glow}, inset 0 0 10px ${ts.glow}`
                          : `0 0 10px ${ts.glow}`,
                        cursor: isProcessing ? 'default' : 'pointer',
                      }}
                    >
                      {/* Shine overlay on selected */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{ background: `radial-gradient(circle, ${ts.border}22 0%, transparent 70%)` }}
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                      <BugIcon type={cell.type} size={TILE_SIZE - 8} />
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Power-ups */}
      <div className="relative z-10 px-4 py-3">
        <PowerUpBar
          charges={powerUpCharges}
          onUse={handlePowerUp}
          firewallActive={firewallActive}
        />
      </div>

      {/* Fail/Complete overlay */}
      <AnimatePresence>
        {phase === 'failed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(6,9,18,0.92)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center px-8"
            >
              <div className="text-5xl mb-4">💀</div>
              <h2 className="text-white mb-2" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                Time's Up
              </h2>
              <p className="text-[#6B7FA3] text-sm">The bugs survived this round.</p>
            </motion.div>
          </motion.div>
        )}
        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(6,9,18,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center px-8"
            >
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-[#43D9BB] mb-2" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                Bugs Cleared!
              </h2>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
                  >
                    <Star size={28} fill={i < stars ? '#FFD84D' : 'transparent'} color={i < stars ? '#FFD84D' : '#3D4E6B'} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
