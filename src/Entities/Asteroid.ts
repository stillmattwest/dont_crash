import Phaser from "phaser";

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  public static group: Phaser.Physics.Arcade.Group;

  // Asset keys for different asteroid types
  private static xlAsteroids = ["xl_red_01"];
  private static lgAsteroids = [
    "lg_gray_01",
    "lg_gray_02",
    "lg_red_01",
    "lg_red_02",
  ];
  private static mdAsteroids = [
    "md_gray_01",
    "md_gray_02",
    "md_red_01",
    "md_red_02",
  ];

  static initPool(scene: Phaser.Scene): void {
    // Create physics group for asteroids
    this.group = scene.physics.add.group({
      classType: Asteroid,
      maxSize: 20,
      runChildUpdate: true,
    });

    // Pre-create some asteroids
    for (let i = 0; i < 10; i++) {
      const asteroid = new Asteroid(scene, 0, 0, this.getRandomTextureKey());
      this.group.add(asteroid, true);
      asteroid.setActive(false);
      asteroid.setVisible(false);
    }
  }

  static spawn(x: number, y: number, scene: Phaser.Scene): Asteroid | null {
    const asteroid = this.group.get(x, y) as Asteroid;

    if (!asteroid) return null;

    asteroid.setActive(true);
    asteroid.setVisible(true);

    // Reset asteroid properties
    asteroid.setTexture(this.getRandomTextureKey());
    asteroid.setPosition(x, y);

    // Add random rotation and velocity
    const angle = Phaser.Math.Between(0, 360);
    const speed = Phaser.Math.Between(50, 150);

    scene.physics.velocityFromAngle(angle, speed, asteroid.body.velocity);
    asteroid.setAngularVelocity(Phaser.Math.Between(-100, 100));

    return asteroid;
  }

  private static getRandomTextureKey(): string {
    // Randomly select from one of the asteroid types
    const asteroidSets = [this.xlAsteroids, this.lgAsteroids, this.mdAsteroids];
    const selectedSet = Phaser.Math.RND.pick(asteroidSets);
    return Phaser.Math.RND.pick(selectedSet);
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // Enable physics on this sprite
    scene.physics.world.enable(this);

    // Set up collision body
    this.body.setCircle(this.width / 2);
    this.body.setBounce(1, 1);
    this.body.setCollideWorldBounds(true);
  }

  kill(): void {
    this.setActive(false);
    this.setVisible(false);
    this.body.stop();
  }
}
