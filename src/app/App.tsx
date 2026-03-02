import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { AppScreen, LevelConfig, LevelResult, LeaderboardEntry } from './components/game/types';
import { LEVELS } from './components/game/gameData';
import { SplashScreen } from './components/game/SplashScreen';
import { NameInput } from './components/game/NameInput';
import { LevelSelect } from './components/game/LevelSelect';
import { StoryModal } from './components/game/StoryModal';
import { GameScreen } from './components/game/GameScreen';
import { LevelComplete } from './components/game/LevelComplete';
import { Leaderboard } from './components/game/Leaderboard';

// Persistence
function loadProgress(): Record<number, number> {
  try { return JSON.parse(localStorage.getItem('bhProgress') || '{}'); } catch { return {}; }
}
function saveProgress(p: Record<number, number>) {
  try { localStorage.setItem('bhProgress', JSON.stringify(p)); } catch {}
}
function loadLeaderboard(): LeaderboardEntry[] {
  try { return JSON.parse(localStorage.getItem('bhLeaderboard') || '[]'); } catch { return []; }
}
function saveLeaderboard(entries: LeaderboardEntry[]) {
  try { localStorage.setItem('bhLeaderboard', JSON.stringify(entries)); } catch {}
}
function loadPlayerName(): string {
  try { return localStorage.getItem('bhPlayerName') || ''; } catch { return ''; }
}
function savePlayerName(name: string) {
  try { localStorage.setItem('bhPlayerName', name); } catch {}
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [playerName, setPlayerName] = useState(() => loadPlayerName());
  const [progress, setProgress] = useState<Record<number, number>>(loadProgress);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(LEVELS[0]);
  const [lastResult, setLastResult] = useState<LevelResult>({ score: 0, stars: 0 });

  const totalStars = Object.values(progress).reduce((a, b) => a + b, 0);

  const handleNameSubmit = useCallback((name: string) => {
    setPlayerName(name);
    savePlayerName(name);
    setScreen('level-select');
  }, []);

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setCurrentLevel(level);
    setScreen('story');
  }, []);

  const handleStartGame = useCallback(() => {
    setScreen('game');
  }, []);

  const handleGameComplete = useCallback((result: LevelResult) => {
    setLastResult(result);

    // Update progress (keep best stars)
    setProgress(prev => {
      const current = prev[currentLevel.id] || 0;
      const next = { ...prev, [currentLevel.id]: Math.max(current, result.stars) };
      saveProgress(next);
      return next;
    });

    // Update leaderboard
    if (result.stars > 0) {
      setLeaderboard(prev => {
        const newEntry: LeaderboardEntry = {
          name: playerName,
          score: result.score,
          stars: totalStars + result.stars,
          level: currentLevel.id,
          date: new Date().toISOString().slice(0, 10),
        };
        const updated = [newEntry, ...prev]
          .sort((a, b) => b.score - a.score)
          .slice(0, 50);
        saveLeaderboard(updated);
        return updated;
      });
    }

    setScreen('level-complete');
  }, [currentLevel, playerName, totalStars]);

  const handleNextLevel = useCallback(() => {
    const nextId = currentLevel.id + 1;
    if (nextId <= 30) {
      const next = LEVELS[nextId - 1];
      setCurrentLevel(next);
      setScreen('story');
    } else {
      setScreen('level-select');
    }
  }, [currentLevel]);

  const handleRetry = useCallback(() => {
    setScreen('story');
  }, []);

  const screenVariants = {
    initial: { opacity: 0, scale: 0.97, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit:    { opacity: 0, scale: 1.02, y: -10 },
  };

  const transition = { duration: 0.25, ease: 'easeInOut' as const };

  // Auto-forward splash → name input or level select
  const handleSplashContinue = useCallback(() => {
    if (playerName) setScreen('level-select');
    else setScreen('name-input');
  }, [playerName]);

  return (
    <div className="w-screen h-screen bg-[#0A0E1A] relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <motion.div key="splash" className="absolute inset-0"
            variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <SplashScreen onContinue={handleSplashContinue} />
          </motion.div>
        )}

        {screen === 'name-input' && (
          <motion.div key="name-input" className="absolute inset-0"
            variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <NameInput onSubmit={handleNameSubmit} />
          </motion.div>
        )}

        {screen === 'level-select' && (
          <motion.div key="level-select" className="absolute inset-0"
            variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <LevelSelect
              playerName={playerName}
              progress={progress}
              onSelectLevel={handleSelectLevel}
              onLeaderboard={() => setScreen('leaderboard')}
            />
          </motion.div>
        )}

        {screen === 'leaderboard' && (
          <motion.div key="leaderboard" className="absolute inset-0"
            variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <Leaderboard
              entries={leaderboard}
              playerName={playerName}
              onBack={() => setScreen('level-select')}
            />
          </motion.div>
        )}

        {screen === 'story' && (
          <motion.div key="story" className="absolute inset-0"
            variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            {/* Background for story screen */}
            <div className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: '#0A0E1A' }}>
              <div className="absolute inset-0 opacity-[0.025]" style={{
                backgroundImage: 'linear-gradient(#43D9BB 1px, transparent 1px), linear-gradient(90deg, #43D9BB 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }}/>
              <div className="relative z-10 text-center px-8">
                <p className="text-[#3D4E6B] text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  // loading level {currentLevel.id}...
                </p>
                <h2 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {currentLevel.name}
                </h2>
              </div>
            </div>
            <StoryModal
              level={currentLevel}
              onStart={handleStartGame}
              onClose={() => setScreen('level-select')}
            />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div key={`game-${currentLevel.id}`} className="absolute inset-0"
            variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <GameScreen
              levelConfig={currentLevel}
              playerName={playerName}
              onComplete={handleGameComplete}
              onBack={() => setScreen('level-select')}
            />
          </motion.div>
        )}

        {screen === 'level-complete' && (
          <motion.div key="level-complete" className="absolute inset-0"
            variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <LevelComplete
              level={currentLevel}
              result={lastResult}
              prevBestStars={progress[currentLevel.id] || 0}
              onNext={handleNextLevel}
              onRetry={handleRetry}
              onLevelSelect={() => setScreen('level-select')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
