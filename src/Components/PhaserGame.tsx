import React, { useEffect, useRef, JSX } from "react";
import Phaser from "phaser";
import { gameConfig } from "../Phaser/gameConfig";

const PhaserGame: React.FC = (): JSX.Element => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const game = new Phaser.Game(gameConfig);
    gameRef.current = game;

    // Cleanup function
    return () => {
      console.log("Destroying game...");
      game.destroy(true); // Cleanly destroy the Phaser instance
    };
  }, []);

  return <div id="phaser-container" />;
};

export default PhaserGame;
