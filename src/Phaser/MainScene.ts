import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("starField", "assets/starField/bg_space_seamless.png");
  }

  create() {
    this.add.image(600, 400, "starField");
  }

  update() {}
}
