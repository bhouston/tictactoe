export enum GameResult {
  WIN = 'WIN',
  LOSS = 'LOSS',
  DRAW = 'DRAW'
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: number;
  result: GameResult;
  createdAt: string;
  userId: number;
  user?: {
    name: string;
  };
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
  winRate: number;
}