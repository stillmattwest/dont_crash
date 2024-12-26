import Phaser from "phaser";
import { Player } from "../Entities/Player";
import { ParallaxBackground } from "../Entities/ParallaxBackground";
import { Asteroid } from "../Entities/Asteroid";

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

    // intialize asteroid pool
    Asteroid.initPool(this, this.player);

    // temp. spawn a single asteroid
    this.spawnAsteroid();
  }

  update() {
    // PARALLAX BACKGROUND MOVEMENT
    this.background.update();

    // PLAYER UPDATE
    this.player.update();
  }

  private spawnAsteroid(): void {
    // Spawn at a random position along the edges of the screen
    let y = -300;
    let x = Phaser.Math.RND.between(100, this.scale.width - 100);

    Asteroid.spawn(x, y);
  }
}
