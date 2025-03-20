'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameBoard from './GameBoard';
import { GameResult, User } from '@/types';

export default function GameContainer() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameCount, setGameCount] = useState(0);
  const [gameHistory, setGameHistory] = useState<{ result: GameResult, date: Date }[]>([]);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X');

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem('tictactoe-user');
        
        if (!storedUser) {
          // Redirect to home if no user found
          router.push('/');
          return;
        }

        const { name, email } = JSON.parse(storedUser);
        
        // Register or fetch user from the API
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
          throw new Error('Failed to register user');
        }

        const userData = await response.json();
        setUser(userData);

        // Fetch user's game history
        await fetchGameHistory(userData.id);
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Fetch the user's game history
  const fetchGameHistory = async (userId: number) => {
    try {
      const response = await fetch(`/api/games?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch game history');
      }

      const games = await response.json();
      
      // Process games data
      const history = games.map((game: any) => ({
        result: game.result as GameResult,
        date: new Date(game.createdAt)
      }));
      
      setGameHistory(history);
      setGameCount(history.length);
      
      // Calculate stats
      const wins = history.filter(game => game.result === GameResult.WIN).length;
      const losses = history.filter(game => game.result === GameResult.LOSS).length;
      const draws = history.filter(game => game.result === GameResult.DRAW).length;
      
      setStats({ wins, losses, draws });
    } catch (error) {
      console.error('Error fetching game history:', error);
    }
  };

  // Handle game end
  const handleGameEnd = async (result: GameResult) => {
    if (!user) return;
    
    try {
      // Record the game result
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          result,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save game result');
      }

      // Update game history and stats
      const newGame = { result, date: new Date() };
      setGameHistory(prev => [...prev, newGame]);
      setGameCount(prev => prev + 1);
      
      setStats(prev => ({
        wins: result === GameResult.WIN ? prev.wins + 1 : prev.wins,
        losses: result === GameResult.LOSS ? prev.losses + 1 : prev.losses,
        draws: result === GameResult.DRAW ? prev.draws + 1 : prev.draws,
      }));

      // End the current game
      setIsPlaying(false);
    } catch (error) {
      console.error('Error saving game result:', error);
      setError('Failed to save game result. Please try again.');
    }
  };

  // Start a new game
  const startNewGame = () => {
    // Randomly decide if player is X or O
    const randomSymbol = Math.random() > 0.5 ? 'X' : 'O';
    setPlayerSymbol(randomSymbol as 'X' | 'O');
    setIsPlaying(true);
    setError(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Main game container
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* User info and stats */}
      <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Wins</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">{stats.wins}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Losses</div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">{stats.losses}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Draws</div>
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draws}</div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total games played: {gameCount}
            {gameCount > 0 && (
              <> | Win rate: {((stats.wins / gameCount) * 100).toFixed(1)}%</>
            )}
          </p>
        </div>
      </div>

      {/* Game area */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {isPlaying ? (
          <GameBoard 
            onGameEnd={handleGameEnd} 
            playerSymbol={playerSymbol}
          />
        ) : (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Click the button below to start a new game. You'll be randomly assigned X or O.
            </p>
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start New Game
            </button>
          </div>
        )}
      </div>

      {/* Recent games history */}
      {gameHistory.length > 0 && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-2">Recent Games</h3>
          <div className="max-h-40 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {[...gameHistory].reverse().slice(0, 10).map((game, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="py-2">{game.date.toLocaleString()}</td>
                    <td className={`py-2 font-medium ${
                      game.result === GameResult.WIN 
                        ? 'text-green-600 dark:text-green-400' 
                        : game.result === GameResult.LOSS 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {game.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}