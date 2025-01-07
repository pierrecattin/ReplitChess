import type { Chess, Move } from "chess.js";

// Simple piece values for evaluation
const pieceValues: { [key: string]: number } = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

// Evaluate board position
function evaluatePosition(game: Chess): number {
  let score = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type.toLowerCase()];
        score += piece.color === 'w' ? value : -value;
      }
    }
  }

  return score;
}

// Simple minimax implementation (depth 3)
function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluatePosition(game);
  }

  const moves = game.moves({ verbose: true });

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

  for (const move of moves) {
    game.move(move);
    const value = minimax(game, 2, -Infinity, Infinity, false);
    game.undo();

    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
}