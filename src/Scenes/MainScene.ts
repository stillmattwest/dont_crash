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

  preload(): void {
    this.load.image("starField", "assets/starField/bg_space_seamless.png");
    this.load.image("nebula01", "assets/nebula/nebula2.png");
    this.load.image("nebula02", "assets/nebula/nebuladrystars.png");
    this.load.image(
      "parallaxStarField",
      "assets/starField/bd_space_seamless_fl1.png"
    );
    this.load.spritesheet("player", "assets/player/player_blue_sheet.png", {
      frameWidth: 117,
      frameHeight: 95,
    });
    this.load.image("player_laser_01", "assets/projectiles/green_laser_01.png");
    // PROJECTILE SFX
    this.load.audio("laser01_sfx", "assets/projectiles/sfx/laser01.mp3");
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
