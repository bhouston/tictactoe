import Link from 'next/link';
import LeaderboardTable from '@/components/LeaderboardTable';

export const metadata = {
  title: 'Leaderboard - Tic-Tac-Toe Game',
  description: 'See how players rank in our Tic-Tac-Toe game',
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Leaderboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              See how players rank based on their game performance
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-4 flex">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/game"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Play Game
            </Link>
          </div>
        </header>

        <main>
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Player Rankings</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Players are ranked by number of wins, then by win rate
              </p>
            </div>
            
            <LeaderboardTable />
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">How Rankings Work</h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                Players are ranked based on the following criteria:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Primary ranking is by total number of wins</li>
                <li>If two players have the same number of wins, they are ranked by win rate</li>
                <li>Win rate is calculated as (wins / total games) × 100%</li>
              </ul>
              <p className="text-sm italic mt-2">
                Play more games to improve your ranking!
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Tic-Tac-Toe Challenge. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}