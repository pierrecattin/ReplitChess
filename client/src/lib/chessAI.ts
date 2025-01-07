import type { Chess, Move, Square } from "chess.js";

// Enhanced piece values for evaluation
const pieceValues: { [key: string]: number } = {
  p: 100,  // Increased base values to make captures more significant
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Position-based bonus tables for more aggressive piece placement
const pawnPositionBonus = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

// Evaluate immediate captures and threats
function evaluateCaptures(game: Chess): number {
  let captureScore = 0;
  const moves = game.moves({ verbose: true });

  for (const move of moves) {
    if (move.captured) {
      const capturedValue = pieceValues[move.captured];
      const attackerValue = pieceValues[move.piece];

      // Encourage favorable captures (capturing higher value pieces)
      if (capturedValue > attackerValue) {
        captureScore += (capturedValue - attackerValue) * 0.1;
      }
    }
  }

  return captureScore;
}

// Enhanced position evaluation
function evaluatePosition(game: Chess): number {
  let score = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type.toLowerCase()];
        const positionBonus = piece.type.toLowerCase() === 'p' ? 
          (piece.color === 'w' ? pawnPositionBonus[i][j] : -pawnPositionBonus[7-i][j]) : 0;

        // Add position-based bonus to the score
        score += (piece.color === 'w' ? 1 : -1) * (value + positionBonus);

        // Bonus for controlling center squares
        if ((i === 3 || i === 4) && (j === 3 || j === 4)) {
          score += piece.color === 'w' ? 10 : -10;
        }

        // Bonus for piece mobility (number of legal moves)
        const originalTurn = game.turn();
        if (piece.color === originalTurn) {
          const moves = game.moves({ square: `${String.fromCharCode(97 + j)}${8-i}` as Square });
          score += (piece.color === 'w' ? 1 : -1) * moves.length * 5;
        }
      }
    }
  }

  // Add capture opportunities to the score
  score += evaluateCaptures(game);

  // Bonus for checking the opponent
  if (game.isCheck()) {
    score += game.turn() === 'w' ? -50 : 50;
  }

  return score;
}

// Enhanced minimax implementation with aggressive pruning
function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluatePosition(game);
  }

  const moves = game.moves({ verbose: true });

  // Sort moves to evaluate captures first for better pruning
  moves.sort((a, b) => {
    const aValue = a.captured ? pieceValues[a.captured] : 0;
    const bValue = b.captured ? pieceValues[b.captured] : 0;
    return bValue - aValue;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function calculateBestMove(game: Chess): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  let bestMove: Move | null = null;
  let bestValue = -Infinity;

  // Sort moves to evaluate captures first
  moves.sort((a, b) => {
    const aValue = a.captured ? pieceValues[a.captured] : 0;
    const bValue = b.captured ? pieceValues[b.captured] : 0;
    return bValue - aValue;
  });

  for (const move of moves) {
    game.move(move);
    // Decreased depth from 3 to 2 for faster response time
    const value = minimax(game, 2, -Infinity, Infinity, false);
    game.undo();

    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
}