import Phaser from "phaser";
import MainScene from "./MainScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1200, // Game width
  height: 800, // Game height
  scene: [MainScene], // Register your scene here
  physics: {
    default: "arcade", // Physics system
    arcade: {
      debug: false, // Turn on for collision debugging
    },
  },
};
