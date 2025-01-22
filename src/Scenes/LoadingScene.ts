import Phaser from "phaser";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadingScene" });
  }

  preload(): void {
    console.log("LoadingScene preload starting");
    this.load.on("loaderror", (file: any) => {
      console.error("Error loading asset:", file);
    });
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

    // Loading text
    const loadingText = this.add.text(
      width / 2,
      height / 2 - 50,
      "Loading...",
      {
        font: "20px monospace",
        color: "#ffffff",
      }
    );
    loadingText.setOrigin(0.5, 0.5);

    // Percentage text
    const percentText = this.add.text(width / 2, height / 2, "0%", {
      font: "18px monospace",
      color: "#ffffff",
    });
    percentText.setOrigin(0.5, 0.5);

    // Loading event handlers
    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 4, height / 2 - 30, (width / 2) * value, 50);
      percentText.setText(parseInt(String(value * 100)) + "%");
    });

    this.load.on("complete", () => {
      console.log("LoadingScene load complete");
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Load all game assets here
    this.loadBackgroundAssets();
    this.loadPlayerAssets();
    this.loadAsteroidAssets();
    this.loadAudioAssets();
  }

  private loadBackgroundAssets(): void {
    this.load.image("starField", "assets/starField/bg_space_seamless.png");
    this.load.image("nebula01", "assets/nebula/nebula2.png");
    this.load.image("nebula02", "assets/nebula/nebuladrystars.png");
    this.load.image(
      "parallaxStarField",
      "assets/starField/bd_space_seamless_fl1.png"
    );
  }

  private loadPlayerAssets(): void {
    this.load.spritesheet("player", "assets/player/player_blue_sheet.png", {
      frameWidth: 117,
      frameHeight: 95,
    });
    this.load.image("player_laser_01", "assets/projectiles/green_laser_01.png");
  }

  private loadAsteroidAssets(): void {
    this.load.image("lg_gray_01", "assets/asteroids/lg_gray_01.png");
    this.load.image("lg_gray_02", "assets/asteroids/lg_gray_02.png");
    this.load.image("lg_red_01", "assets/asteroids/lg_red_01.png");
    this.load.image("lg_red_02", "assets/asteroids/lg_red_02.png");
    this.load.image("md_gray_01", "assets/asteroids/md_gray_01.png");
    this.load.image("md_gray_02", "assets/asteroids/md_gray_02.png");
    this.load.image("md_red_01", "assets/asteroids/md_red_01.png");
    this.load.image("md_red_02", "assets/asteroids/md_red_02.png");
    this.load.image("xl_red_01", "assets/asteroids/xl_red_01.png");
  }

  // private loadEnemyAssets(): void {
  //   // Add enemy assets here as your game grows
  // }

  // private loadUIAssets(): void {
  //   // Add UI assets here
  // }

  private loadAudioAssets(): void {
    this.load.audio("laser01_sfx", "assets/projectiles/sfx/laser01.mp3");
  }

  create() {
    console.log("LoadingScene create - transitioning to MainScene");
    this.scene.start("MainScene");
  }
}
