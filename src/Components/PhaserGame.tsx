import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GameConfig } from "../Phaser/game";

const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const game = new Phaser.Game(GameConfig);
    gameRef.current = game;

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container" />;
};

export default PhaserGame;
