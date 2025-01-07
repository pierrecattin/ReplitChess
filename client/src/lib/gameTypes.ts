export interface GameState {
  status: "playing" | "gameOver";
  turn: "w" | "b";
  inCheck: boolean;
}
