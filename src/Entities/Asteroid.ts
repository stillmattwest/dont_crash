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
    const texture = this.getRandomTextureKey();
    console.log("Spawning asteroid with texture:", texture); // Debug log

    const asteroid = this.group.get(x, y, texture) as Asteroid;
    if (!asteroid) return null;

    asteroid.setActive(true);
    asteroid.setVisible(true);
    asteroid.setPosition(x, y);

    // Debug: Log asteroid properties
    console.log("Asteroid position:", x, y);
    console.log("Asteroid scale:", asteroid.scaleX, asteroid.scaleY);
    console.log("Asteroid size:", asteroid.width, asteroid.height);
    console.log("Asteroid visible:", asteroid.visible);

    return asteroid;
  }

  private static getRandomTextureKey(): string {
    // Randomly select from one of the asteroid types
    const asteroidSets = [this.xlAsteroids, this.lgAsteroids, this.mdAsteroids];
    const selectedSet = Phaser.Math.RND.pick(asteroidSets);
    const texture = Phaser.Math.RND.pick(selectedSet);
    console.log("Selected asteroid texture:", texture); // Debug log
    return texture;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // Enable physics on this sprite
    scene.physics.world.enable(this);

    // Make asteroid more visible
    this.setScale(0.5); // Adjust this value as needed
    this.setTint(0xffffff); // Full brightness

    // Set up collision body
    this.body.setCircle(this.width / 3); // Smaller collision circle
    this.body.setBounce(1, 1);
    this.body.setCollideWorldBounds(true);

    // Debug: Draw border directly on the scene
    const debugRect = scene.add.rectangle(
      x,
      y,
      this.width,
      this.height,
      0xff0000,
      0 // alpha of 0 for no fill
    );
    debugRect.setStrokeStyle(2, 0xff0000); // 2px red border
    debugRect.setOrigin(0.5);
  }

  kill(): void {
    this.setActive(false);
    this.setVisible(false);
    this.body.stop();
  }
}
