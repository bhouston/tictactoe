import UserForm from "@/components/UserForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <main className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* App description section */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Tic-Tac-Toe Challenge
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Test your skills against our AI opponent!
            </p>
          </div>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Welcome to our Tic-Tac-Toe game! This classic game of X&apos;s and O&apos;s 
              is simple to learn but challenging to master.
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">How to Play:</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Enter your name and email to get started</li>
                <li>Make your move by clicking on an empty square</li>
                <li>Try to get three of your marks in a row (horizontally, vertically, or diagonally)</li>
                <li>Block the computer from getting three in a row</li>
                <li>The first player to get three in a row wins!</li>
              </ul>
            </div>
            
            <p>
              Your game results will be saved, and you can see how you rank against other 
              players on our leaderboard.
            </p>
          </div>
        </div>
        
        {/* Registration form section */}
        <div className="w-full md:w-1/2">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ready to Play?</h2>
            <p className="text-gray-600 dark:text-gray-300">Enter your details to start the game</p>
          </div>
          <UserForm />
        </div>
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Tic-Tac-Toe Challenge. All rights reserved.</p>
      </footer>
    </div>
  );
}