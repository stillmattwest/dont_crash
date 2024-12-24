class Asteroid extends Phaser.Physics.Arcade.Sprite {
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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Asteroid.SPRITE_KEYS[0]);
    scene.physics.add.existing(this);

    this.setupPhysics();
  }

  public static initPool(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite
  ): void {
    for (let i = 0; i < this.POOL_SIZE; i++) {
      const asteroid = new Asteroid(scene, 0, 0);
      asteroid.setActive(false);
      asteroid.setVisible(false);
      this.pool.push(asteroid);
      asteroid.setupCollisions(player, this.pool);
    }
  }

  public static spawn(x: number, y: number): Asteroid | undefined {
    const inactiveAsteroids = this.pool.filter((a) => !a.active);
    const asteroid = Phaser.Math.RND.pick(inactiveAsteroids);

    if (asteroid) {
      asteroid.reset(x, y);
    }
    return asteroid;
  }

  private setupPhysics(): void {
    this.setCollideWorldBounds(true);
    this.setBounce(1, 1);
    this.setDrag(0);
  }

  private setRandomMovement(): void {
    this.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(-100, 100)
    );
    this.setAngularVelocity(Phaser.Math.Between(-100, 100));
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
