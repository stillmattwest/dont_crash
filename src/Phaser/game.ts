import Phaser from "phaser";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: "#1d212d",
  scene: {
    preload: preload,
    create: create,
  },
};

function preload(this: Phaser.Scene) {}

function create(this: Phaser.Scene) {
  this.add.text(100, 100, "Welcome to Don't Crash!", {
    font: "16px Arial",
    color: "#ffffff",
  });

  this.add.text(100, 200, "Loading...", {
    font: "16px Arial",
    color: "#ffffff",
  });
}
