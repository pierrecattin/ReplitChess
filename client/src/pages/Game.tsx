import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChessBoard from "@/components/ChessBoard";
import GameControls from "@/components/GameControls";
import { calculateBestMove } from "@/lib/chessAI";
import type { GameState } from "@/lib/gameTypes";

function Game() {
  const [game, setGame] = useState(new Chess());
  const [gameState, setGameState] = useState<GameState>({
    status: "playing",
    turn: "w",
    inCheck: false,
  });
  const { toast } = useToast();

  const makeMove = useCallback((from: string, to: string) => {
    try {
      const move = game.move({
        from,
        to,
        promotion: "q", // Always promote to queen for simplicity
      });

      if (move) {
        setGame(new Chess(game.fen()));
        setGameState({
          status: game.isGameOver() ? "gameOver" : "playing",
          turn: game.turn(),
          inCheck: game.isCheck(),
        });

        // If the game isn't over and it's black's turn, make AI move
        if (!game.isGameOver() && game.turn() === "b") {
          setTimeout(() => {
            const aiMove = calculateBestMove(game);
            if (aiMove) {
              game.move(aiMove);
              setGame(new Chess(game.fen()));
              setGameState({
                status: game.isGameOver() ? "gameOver" : "playing",
                turn: game.turn(),
                inCheck: game.isCheck(),
              });
            }
          }, 500);
        }
      }
    } catch (error) {
      toast({
        title: "Invalid Move",
        description: "That move is not allowed",
        variant: "destructive",
      });
    }
  }, [game, toast]);

  const resetGame = useCallback(() => {
    setGame(new Chess());
    setGameState({
      status: "playing",
      turn: "w",
      inCheck: false,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Chess Game</h1>
              <p className="text-muted-foreground">
                Play against the AI - You are White
              </p>
            </div>

            <ChessBoard
              position={game.fen()}
              onMove={makeMove}
              gameState={gameState}
            />

            <GameControls
              gameState={gameState}
              onReset={resetGame}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Game;
