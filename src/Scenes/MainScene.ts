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
    console.log("MainScene create starting");

    // Check if at least one asteroid texture is loaded
    const asteroidSets = [
      ["xl_red_01"],
      ["lg_gray_01", "lg_gray_02", "lg_red_01", "lg_red_02"],
      ["md_gray_01", "md_gray_02", "md_red_01", "md_red_02"],
    ];

    const hasAnyAsteroidTexture = asteroidSets.some((set) =>
      set.some((key) => this.textures.exists(key))
    );

    if (!hasAnyAsteroidTexture) {
      console.error("No asteroid textures are loaded!");
      return;
    }

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
    if (this.background) {
      this.background.update();
    }

    // PLAYER UPDATE
    if (this.player) {
      this.player.update();
    }
  }

  private spawnAsteroid(): void {
    // Spawn at a random position along the top of the screen
    const x = Phaser.Math.Between(100, this.scale.width - 100);
    const y = -100; // Spawn above the screen

    const asteroid = Asteroid.spawn(x, y, this);
    if (asteroid) {
      // Set primarily downward velocity with slight horizontal variation
      const horizontalSpeed = Phaser.Math.Between(-50, 50); // Mild left/right movement
      const verticalSpeed = Phaser.Math.Between(100, 200); // Faster downward movement

      (asteroid.body as Phaser.Physics.Arcade.Body).setVelocity(
        horizontalSpeed,
        verticalSpeed
      );
    }
  }

  private handleCollision(obj1: any, obj2: any) {
    const player = obj1 as Player;
    const asteroid = obj2 as Asteroid;

    // Strong rebound for player, minimal for asteroid
    const rebound = new Phaser.Math.Vector2()
      .copy((player.body as Phaser.Physics.Arcade.Body).velocity)
      .normalize()
      .scale(-300);

    (player.body as Phaser.Physics.Arcade.Body).setVelocity(
      rebound.x,
      rebound.y
    );

    // Minimal effect on asteroid (10% of player's rebound)
    (asteroid.body as Phaser.Physics.Arcade.Body).setVelocity(
      -rebound.x * 0.1,
      -rebound.y * 0.1
    );
  }
}
