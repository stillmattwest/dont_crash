import Phaser from "phaser";
import MainScene from "../Scenes/MainScene";
import { LoadingScene } from "../Scenes/LoadingScene.ts";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1200, // Game width
  height: 700, // Game height
  scene: [LoadingScene, MainScene], // Register your scene here
  input: { gamepad: true },
  physics: {
    default: "arcade", // Physics system
    arcade: {
      debug: false, // Turn on for collision debugging
    },
  },
};
