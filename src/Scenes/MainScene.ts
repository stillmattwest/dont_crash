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
    // for debugging. adds visible physics bodies
    this.physics.world.createDebugGraphic();

    // add starField background
    this.background = new ParallaxBackground(this);

    // add player
    this.player = new Player(this, 600, 400);

    // initialize asteroid pool
    Asteroid.initPool(this);

    // temp. spawn a single asteroid
    this.spawnAsteroid();

    // Set up collision between asteroids and player
    this.physics.add.collider(
      this.player,
      Asteroid.group, // Now using the static group property
      this.handleCollision,
      undefined,
      this
    );
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

    Asteroid.spawn(x, y, this); // Added 'this' as the scene parameter
  }

  private handleCollision(_obj1: any, _obj2: any) {
    console.log("Collision!");
    // Add your collision logic here
  }
}
