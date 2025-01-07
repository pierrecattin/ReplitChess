export interface GameState {
  status: "playing" | "checkmate" | "stalemate" | "draw";
  turn: "w" | "b";
  inCheck: boolean;
  winner?: "w" | "b";
}