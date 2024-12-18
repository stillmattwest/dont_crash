import Phaser from "phaser";
import { calculateBgScale } from "../Utilities/calculateBGScale";

export class ParallaxBackground {
  private scene: Phaser.Scene;
  private starField: Phaser.GameObjects.Image;
  private parallaxStarField: Phaser.GameObjects.TileSprite;
  private nebula01: Phaser.GameObjects.TileSprite;
  private nebula02: Phaser.GameObjects.TileSprite;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createLayers();
  }

  private createLayers(): void {
    // Base starfield layer
    this.starField = this.scene.add.image(0, 0, "starField");
    const baseScale = calculateBgScale(
      this.starField.width,
      this.starField.height,
      this.scene.scale.width,
      this.scene.scale.height
    );
    this.starField.setScale(baseScale);
    this.starField.setOrigin(0, 0);
    this.starField.setPosition(0, 0);

    // Parallax starfield layer
    this.parallaxStarField = this.scene.add.tileSprite(
      0,
      0,
      0,
      0,
      "parallaxStarField"
    );

    // Nebula layer 1
    this.nebula01 = this.scene.add.tileSprite(0, 0, 0, 0, "nebula01");
    const neb01Scale = calculateBgScale(
      this.nebula01.width,
      this.nebula01.height,
      this.scene.scale.width,
      this.scene.scale.height
    );
    this.nebula01.setScale(neb01Scale);
    this.nebula01.setOrigin(0, 0);
    this.nebula01.tilePositionY = 0;

    // Nebula layer 2
    this.nebula02 = this.scene.add.tileSprite(0, 0, 0, 0, "nebula02");
    const neb02Scale = calculateBgScale(
      this.nebula02.width,
      this.nebula02.height,
      this.scene.scale.width,
      this.scene.scale.height
    );
    this.nebula02.setScale(neb02Scale);
    this.nebula02.setOrigin(0, 0);
  }

  update(): void {
    // Update parallax effects
    this.nebula01.tilePositionY -= 0.3;
    this.nebula02.tilePositionY -= 0.15;
    this.parallaxStarField.tilePositionY -= 0.1;
  }
}
