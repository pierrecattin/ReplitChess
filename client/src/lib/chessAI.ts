import type { Chess, Move } from "chess.js";

// Piece-square tables for positional evaluation
const pawnTable = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const knightTable = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const bishopTable = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const rookTable = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const queenTable = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const kingTableMiddlegame = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

// Piece values for material evaluation
const pieceValues: { [key: string]: number } = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Get piece square table value
function getPieceSquareTableValue(piece: string, square: number, isEndgame: boolean): number {
  const type = piece.toLowerCase();
  const isWhite = piece === piece.toUpperCase();
  const tableIndex = isWhite ? square : 63 - square;

  switch (type) {
    case 'p': return pawnTable[tableIndex];
    case 'n': return knightTable[tableIndex];
    case 'b': return bishopTable[tableIndex];
    case 'r': return rookTable[tableIndex];
    case 'q': return queenTable[tableIndex];
    case 'k': return kingTableMiddlegame[tableIndex];
    default: return 0;
  }
}

// Count material on the board
function countMaterial(game: Chess): number {
  let material = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type.toLowerCase()];
        material += piece.color === 'w' ? value : -value;
      }
    }
  }

  return material;
}

// Evaluate position considering material, piece positioning, and game phase
function evaluatePosition(game: Chess): number {
  const board = game.board();
  let score = 0;
  let material = 0;

  // Count total material to determine game phase
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type.toLowerCase()];
        material += value;

        // Add piece-square table values
        const squareIndex = i * 8 + j;
        const psValue = getPieceSquareTableValue(piece.type, squareIndex, material < 3000);
        score += piece.color === 'w' ? psValue : -psValue;

        // Add material value
        score += piece.color === 'w' ? value : -value;
      }
    }
  }

  // Bonus for mobility (number of legal moves)
  const moves = game.moves();
  score += moves.length * 5 * (game.turn() === 'w' ? 1 : -1);

  // Penalty for being in check
  if (game.isCheck()) {
    score += game.turn() === 'w' ? -50 : 50;
  }

  return score;
}

// Enhanced minimax with increased depth and alpha-beta pruning
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

  // Increase search depth to 3 for better lookahead
  const searchDepth = 3;

  for (const move of moves) {
    game.move(move);
    const value = minimax(game, searchDepth, -Infinity, Infinity, false);
    game.undo();

    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
}