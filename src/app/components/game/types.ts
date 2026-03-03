export interface Cell {
  type: number; // 0-4 = bug type, -1 = empty
  id: string;
}

export interface Position {
  row: number;
  col: number;
}

export interface LevelObjective {
  bugType: number;
  count: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  timeLimit: number;
  objectives: LevelObjective[];
  starThresholds: [number, number, number];
  story: { title: string; text: string; character: string };
}

export type PowerUpType = 'freeze' | 'hotfix' | 'refactor' | 'firewall';

export interface PowerUpDef {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  stars: number;
  level: number;
  date: string;
}

export type AppScreen =
  | 'splash'
  | 'name-input'
  | 'level-select'
  | 'story'
  | 'game'
  | 'level-complete'
  | 'leaderboard';

export interface LevelResult {
  score: number;
  stars: number;
}
