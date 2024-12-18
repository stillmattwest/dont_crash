import Phaser from "phaser";
import { Player } from "../Entities/Player";
import { ParallaxBackground } from "../Entities/ParallaxBackground";

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private background!: ParallaxBackground;

  constructor() {
    super({
      key: "MainScene",
    });
  }

  create() {
    // add starField background
    this.background = new ParallaxBackground(this);

    // add player
    this.player = new Player(this, 600, 400);
  }

  update() {
    // PARALLAX BACKGROUND MOVEMENT
    this.background.update();

    // PLAYER UPDATE
    this.player.update();
  }
}
