// Define the possible values for a cell
export type CellValue = 'X' | 'O' | null;

// Check if there's a winner on the board
export function checkWinner(board: CellValue[]): CellValue {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

// Check if the board is full
export function isBoardFull(board: CellValue[]): boolean {
  return !board.includes(null);
}

// Get all available moves (empty cells)
export function getAvailableMoves(board: CellValue[]): number[] {
  return board.reduce<number[]>((moves, cell, index) => {
    if (cell === null) {
      moves.push(index);
    }
    return moves;
  }, []);
}

// Minimax algorithm for optimal AI move
export function findBestMove(board: CellValue[], computerSymbol: CellValue): number {
  const playerSymbol = computerSymbol === 'X' ? 'O' : 'X';
  
  // If the board is empty or nearly empty, use a simpler strategy
  const filledCells = board.filter(cell => cell !== null).length;
  if (filledCells <= 1) {
    // For the first move or second move, prefer the center or a corner
    if (board[4] === null) return 4; // Center
    
    // Choose a random corner
    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
  }
  
  // Helper function to evaluate the board
  const evaluate = (board: CellValue[]): number => {
    const winner = checkWinner(board);
    if (winner === computerSymbol) return 10;
    if (winner === playerSymbol) return -10;
    return 0;
  };
  
  // Minimax algorithm
  const minimax = (board: CellValue[], depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    // Base cases
    const score = evaluate(board);
    if (score === 10) return score - depth; // Prefer quicker wins
    if (score === -10) return score + depth; // Delay losses
    if (isBoardFull(board)) return 0;
    
    const availableMoves = getAvailableMoves(board);
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of availableMoves) {
        board[move] = computerSymbol;
        const score = minimax(board, depth + 1, false, alpha, beta);
        board[move] = null;
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of availableMoves) {
        board[move] = playerSymbol;
        const score = minimax(board, depth + 1, true, alpha, beta);
        board[move] = null;
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return bestScore;
    }
  };
  
  // Find the best move
  let bestScore = -Infinity;
  let bestMove = -1;
  const availableMoves = getAvailableMoves(board);
  
  // Randomize move order for variety when multiple moves have the same score
  const shuffledMoves = [...availableMoves].sort(() => Math.random() - 0.5);
  
  for (const move of shuffledMoves) {
    board[move] = computerSymbol;
    const score = minimax(board, 0, false);
    board[move] = null;
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}