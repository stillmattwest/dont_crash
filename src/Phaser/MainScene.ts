import Phaser from "phaser";
import { calculateBgScale } from "../Utilities/calculateBGScale";

export default class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("starField", "assets/starField/bg_space_seamless.png");
    this.load.image("player", "assets/player/Blue_Player_Ship_2.png");
  }

  create() {
    let starField = this.add.image(0, 0, "starField");
    const scale = calculateBgScale(
      starField.width,
      starField.height,
      this.scale.width,
      this.scale.height
    );
    starField.setScale(scale);
    starField.setOrigin(0, 0);
    starField.setPosition(0, 0);
    let player = this.add.image(600, 400, "playerShip");
    player.setScale(0.5);
  }

  update() {}
}
