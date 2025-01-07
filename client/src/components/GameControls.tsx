import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import type { GameState } from "@/lib/gameTypes";

interface GameControlsProps {
  gameState: GameState;
  onReset: () => void;
}

export default function GameControls({ gameState, onReset }: GameControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge variant={gameState.turn === "w" ? "default" : "secondary"}>
          {gameState.turn === "w" ? "Your Turn" : "AI Thinking..."}
        </Badge>
        {gameState.inCheck && (
          <Badge variant="destructive">Check!</Badge>
        )}
        {gameState.status === "gameOver" && (
          <Badge variant="destructive">Game Over</Badge>
        )}
      </div>
      
      <Button
        variant="outline"
        onClick={onReset}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        New Game
      </Button>
    </div>
  );
}
