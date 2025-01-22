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
    // Temporarily only use large asteroids until we fix medium ones
    const asteroidSets = [this.lgAsteroids]; // Remove mdAsteroids and xlAsteroids
    const selectedSet = Phaser.Math.RND.pick(asteroidSets);
    const texture = Phaser.Math.RND.pick(selectedSet);
    console.log("Selected asteroid texture:", texture); // Debug log
    return texture;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // Enable physics on this sprite
    scene.physics.world.enable(this);

    // Set scale based on asteroid size
    if (texture.startsWith("md_")) {
      this.setScale(2.0); // Medium asteroids at 200% size
    } else {
      this.setScale(1.0); // Keep original scale for large and xl asteroids
    }

    this.setTint(0xffffff); // Full brightness

    // Get the actual texture dimensions
    const frame = scene.textures.get(texture).getSourceImage();
    const scaledWidth = frame.width * this.scaleX;
    const radius = (scaledWidth / 2) * 0.9; // 10% smaller than sprite radius

    // Set up collision body after scaling
    this.body.setCircle(
      radius,
      (frame.width - radius * 2) / 2, // Offset X to center
      (frame.height - radius * 2) / 2 // Offset Y to center
    );
    this.body.setBounce(1, 1);
    this.body.setCollideWorldBounds(true);

    // Debug visualization
    if (scene.physics.world.drawDebug) {
      // Only add if debug is enabled
      const debugCircle = scene.add.circle(x, y, radius, 0x00ff00, 0);
      debugCircle.setStrokeStyle(1, 0x00ff00); // Green circle for collision visualization
      console.log("Debug circle radius:", radius); // Debug log
    }
  }

  kill(): void {
    this.setActive(false);
    this.setVisible(false);
    this.body.stop();
  }
}
