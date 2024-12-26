import { Physics } from "phaser";

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
  private static readonly SPRITE_KEYS = [
    "gray_asteroid_lg_01",
    "gray_asteroid_lg_02",
    "gray_asteroid_lg_03",
    "red_asteroid_lg_01",
    "red_asteroid_lg_02",
    "red_asteroid_lg_03",
  ];
  private static readonly POOL_SIZE = 10;
  private static pool: Asteroid[] = [];
  private static activeSprites: Set<string> = new Set();

  constructor(scene: Phaser.Scene, x: number, y: number, spriteKey: string) {
    super(scene, x, y, spriteKey);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setupPhysics();
  }

  public static initPool(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite
  ): void {
    for (let i = 0; i < this.POOL_SIZE; i++) {
      const randomKey = Phaser.Math.RND.pick(this.SPRITE_KEYS);
      const asteroid = new Asteroid(scene, 0, 0, randomKey);
      asteroid.setActive(false);
      asteroid.setVisible(false);
      this.pool.push(asteroid);
      asteroid.setupCollisions(player, this.pool);
      this.activeSprites.add(randomKey);
    }
  }

  public static spawn(x: number, y: number): Asteroid | undefined {
    const inactiveAsteroids = this.pool.filter((a) => !a.active);
    const asteroid = Phaser.Math.RND.pick(inactiveAsteroids);

    if (asteroid) {
      asteroid.reset(x, y);
      asteroid.setRandomMovement();
      asteroid.setScale(0.5);
    }
    return asteroid;
  }

  private setupPhysics(): void {
    this.setCollideWorldBounds(false);
    this.setBounce(1, 1);
    this.setDrag(0);
  }

  private setRandomMovement(): void {
    let xVelocity: number;
    let yVelocity = Phaser.Math.Between(50, 100);
    if (this.body!.velocity.x < 0) {
      xVelocity = Phaser.Math.Between(10, 25);
    } else {
      xVelocity = Phaser.Math.Between(-10, -25);
    }
    this.setVelocity(xVelocity, yVelocity);
    this.setAngularVelocity(Phaser.Math.Between(-20, 20));
  }

  public reset(x: number, y: number): void {
    const availableSprites = Asteroid.SPRITE_KEYS.filter(
      (key) => !Asteroid.activeSprites.has(key)
    );

    const spriteKey =
      availableSprites.length > 0
        ? Phaser.Math.RND.pick(availableSprites)
        : Phaser.Math.RND.pick(Asteroid.SPRITE_KEYS);

    if (this.texture.key) {
      Asteroid.activeSprites.delete(this.texture.key);
    }

    Asteroid.activeSprites.add(spriteKey);

    this.setTexture(spriteKey);
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);

    this.body!.enable = true;
    this.setRandomMovement();
  }

  public setupCollisions(
    player: Phaser.Physics.Arcade.Sprite,
    asteroidPool: Asteroid[]
  ): void {
    this.scene.physics.add.collider(this, player);
    this.scene.physics.add.collider(this, asteroidPool);
  }

  public destroy(fromScene?: boolean): void {
    Asteroid.activeSprites.delete(this.texture.key);
    super.destroy(fromScene);
  }
}
