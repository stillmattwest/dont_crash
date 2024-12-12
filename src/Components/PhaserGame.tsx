import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { gameConfig } from "../Phaser/gameConfig";

const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const game = new Phaser.Game(gameConfig);
    gameRef.current = game;

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container" />;
};

export default PhaserGame;
