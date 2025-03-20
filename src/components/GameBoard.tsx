'use client';

import { useState, useEffect } from 'react';
import { GameResult } from '@/types';
import { CellValue, checkWinner, isBoardFull, findBestMove } from '@/lib/gameLogic';

// Define the game state
interface GameState {
  board: CellValue[];
  isPlayerTurn: boolean;
  gameStatus: 'playing' | 'won' | 'lost' | 'draw';
  winner: CellValue;
}

interface GameBoardProps {
  onGameEnd: (result: GameResult) => void;
  playerSymbol: 'X' | 'O';
}

export default function GameBoard({ onGameEnd, playerSymbol = 'X' }: GameBoardProps) {
  const computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
  
  // Initialize the game state
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    isPlayerTurn: playerSymbol === 'X', // X goes first by convention
    gameStatus: 'playing',
    winner: null,
  });

  // Check if there's a winner or a draw
  const checkGameStatus = (board: CellValue[]): { status: 'playing' | 'won' | 'lost' | 'draw', winner: CellValue } => {
    const winner = checkWinner(board);
    
    if (winner) {
      const status = winner === playerSymbol ? 'won' : 'lost';
      return { status, winner };
    }

    // Check for a draw
    if (isBoardFull(board)) {
      return { status: 'draw', winner: null };
    }

    // Game is still in progress
    return { status: 'playing', winner: null };
  };

  // Handle player's move
  const handleCellClick = (index: number) => {
    // Ignore clicks if it's not the player's turn or the game is over
    if (!gameState.isPlayerTurn || gameState.gameStatus !== 'playing' || gameState.board[index] !== null) {
      return;
    }

    // Create a new board with the player's move
    const newBoard = [...gameState.board];
    newBoard[index] = playerSymbol;

    // Check if the game is over after the player's move
    const { status, winner } = checkGameStatus(newBoard);

    // Update the game state
    setGameState({
      board: newBoard,
      isPlayerTurn: false,
      gameStatus: status,
      winner,
    });
  };

  // Computer makes a move
  const computerMove = () => {
    // Don't make a move if the game is over
    if (gameState.gameStatus !== 'playing') {
      return;
    }

    const newBoard = [...gameState.board];
    const move = findBestMove(newBoard, computerSymbol);
    
    if (move !== -1) {
      newBoard[move] = computerSymbol;
      const { status, winner } = checkGameStatus(newBoard);
      
      setGameState({
        board: newBoard,
        isPlayerTurn: true,
        gameStatus: status,
        winner,
      });
    }
  };

  // Computer makes a move when it's its turn
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (!gameState.isPlayerTurn && gameState.gameStatus === 'playing') {
      // Add a small delay to make it feel more natural
      timeoutId = setTimeout(() => {
        computerMove();
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [gameState.isPlayerTurn, gameState.gameStatus]);

  // Notify parent component when the game ends
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      let result: GameResult;
      
      if (gameState.gameStatus === 'won') {
        result = GameResult.WIN;
      } else if (gameState.gameStatus === 'lost') {
        result = GameResult.LOSS;
      } else {
        result = GameResult.DRAW;
      }
      
      onGameEnd(result);
    }
  }, [gameState.gameStatus, onGameEnd]);

  // Render the game board
  return (
    <div className="flex flex-col items-center">
      {/* Game status message */}
      <div className="mb-4 text-xl font-bold text-center">
        {gameState.gameStatus === 'playing' ? (
          gameState.isPlayerTurn ? 'Your turn' : 'Computer is thinking...'
        ) : gameState.gameStatus === 'won' ? (
          'You won!'
        ) : gameState.gameStatus === 'lost' ? (
          'You lost!'
        ) : (
          'It\'s a draw!'
        )}
      </div>

      {/* Game board */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {gameState.board.map((cell, index) => (
          <button
            key={index}
            className={`w-20 h-20 flex items-center justify-center text-3xl font-bold bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm transition-colors
              ${gameState.isPlayerTurn && cell === null && gameState.gameStatus === 'playing' ? 'hover:bg-gray-100 dark:hover:bg-gray-600' : ''}
              ${cell === 'X' ? 'text-blue-600 dark:text-blue-400' : cell === 'O' ? 'text-red-600 dark:text-red-400' : ''}
              ${gameState.gameStatus !== 'playing' && cell === gameState.winner ? 'bg-yellow-100 dark:bg-yellow-900 border-yellow-400' : ''}
            `}
            onClick={() => handleCellClick(index)}
            disabled={cell !== null || gameState.gameStatus !== 'playing' || !gameState.isPlayerTurn}
            aria-label={`Cell ${index + 1}, ${cell || 'empty'}`}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Player info */}
      <div className="flex justify-between w-full max-w-xs mb-4">
        <div className="text-center">
          <div className="font-bold">You</div>
          <div className={`text-xl ${playerSymbol === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {playerSymbol}
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold">Computer</div>
          <div className={`text-xl ${computerSymbol === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {computerSymbol}
          </div>
        </div>
      </div>
      
      {/* Game result message and replay button */}
      {gameState.gameStatus !== 'playing' && (
        <div className="mt-4 text-center">
          <p className="mb-4 text-lg">
            {gameState.gameStatus === 'won' ? (
              'Congratulations! You won this round.'
            ) : gameState.gameStatus === 'lost' ? (
              'Better luck next time!'
            ) : (
              'It\'s a draw! Good game.'
            )}
          </p>
        </div>
      )}
    </div>
  );
}