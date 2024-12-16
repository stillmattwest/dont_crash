import Phaser from "phaser";
import { calculateBgScale } from "../Utilities/calculateBGScale";

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private pad?: Phaser.Input.Gamepad.Gamepad;
  private nebula01!: Phaser.GameObjects.TileSprite;
  private nebula02!: Phaser.GameObjects.TileSprite;
  private parallaxStarField!: Phaser.GameObjects.TileSprite;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private lastFired?: number;

  constructor() {
    super({
      key: "MainScene",
    });
  }

  preload() {
    this.load.image("starField", "assets/starField/bg_space_seamless.png");
    this.load.image("nebula01", "assets/nebula/nebula2.png");
    this.load.image("nebula02", "assets/nebula/nebuladrystars.png");
    this.load.image(
      "parallaxStarField",
      "assets/starField/bd_space_seamless_fl1.png"
    );
    this.load.spritesheet("player", "assets/player/player_blue_sheet.png", {
      frameWidth: 117,
      frameHeight: 95,
    });
    this.load.image("player_laser_01", "assets/projectiles/green_laser_01.png");
  }

  create() {
    // add starField background
    let starField = this.add.image(0, 0, "starField");
    const scale = calculateBgScale(
      starField.width,
      starField.height,
      this.scale.width,
      this.scale.height
    );
    starField.setScale(scale);
    starField.setOrigin(0, 0);
    starField.setPosition(0, 0);

    this.parallaxStarField = this.add.tileSprite(
      0,
      0,
      0,
      0,
      "parallaxStarField"
    );

    // add nebula parallax layer 1
    this.nebula01 = this.add.tileSprite(0, 0, 0, 0, "nebula01");
    const neb_01_scale = calculateBgScale(
      this.nebula01.width,
      this.nebula01.height,
      this.scale.width,
      this.scale.height
    );
    this.nebula01.setScale(neb_01_scale);
    this.nebula01.setOrigin(0, 0);
    this.nebula01.tilePositionY = 0;

    // second layer for parallax
    this.nebula02 = this.add.tileSprite(0, 0, 0, 0, "nebula02");
    const neb_02_scale = calculateBgScale(
      this.nebula02.width,
      this.nebula02.height,
      this.scale.width,
      this.scale.height
    );
    this.nebula02.setScale(neb_02_scale);
    this.nebula02.setOrigin(0, 0);

    // add player with physics
    this.player = this.physics.add.sprite(600, 400, "player");
    this.player.setScale(0.5);

    // set player physics properties
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // set player engine animation
    this.anims.create({
      key: "player_engine",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    // add projectile pool
    this.projectiles = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      defaultKey: "player_laser_01",
      maxSize: 100,
    });

    // setup cursor keys
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // setup gamepads
    if (this.input.gamepad) {
      this.input.gamepad?.once(
        "connected",
        (pad: Phaser.Input.Gamepad.Gamepad) => {
          console.log(`gamepad connected`);
          this.pad = pad;
        }
      );
    } else {
      // setup cursor keys
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
      }
    }
    // set lastFired variable
    this.lastFired = this.time.now;
  }

  update() {
    // PARALLAX BACKGROUND MOVEMENT
    this.nebula01.tilePositionY -= 0.3;
    this.nebula02.tilePositionY -= 0.15;
    this.parallaxStarField.tilePositionY -= 0.1;

    // PLAYER ENGINES
    this.player.anims.play("player_engine", true);

    // PLAYER MOVEMENT
    const speed = 300;

    // GAMEPAD MOVEMENT
    if (this.pad) {
      // Using the left analog stick
      const leftStickX = this.pad.axes[0]?.getValue() || 0; // Horizontal axis
      const leftStickY = this.pad.axes[1]?.getValue() || 0; // Vertical axis
      const deadZone = 0.2;

      let xVelocity = 0;
      let yVelocity = 0;

      // Apply movement based on stick input
      // Apply the dead zone
      if (Math.abs(leftStickX) > deadZone) {
        xVelocity = leftStickX * speed; // Scale velocity as needed
      }

      if (Math.abs(leftStickY) > deadZone) {
        yVelocity = leftStickY * speed;
      }

      if (this.pad.buttons[0]?.pressed) {
        // fire main weapon
        console.log("fire!");
        this.fireProjectile();
      }

      // Set the velocity of the player ship
      this.player.setVelocity(xVelocity, yVelocity);
    } else {
      // KEYBOARD MOVEMENT
      // horizontal player movement
      if (this.cursors?.left.isDown) {
        this.player.setVelocityX(-speed);
      } else if (this.cursors?.right.isDown) {
        this.player.setVelocityX(speed);
      } else {
        this.player.setVelocityX(0);
      }

      // vertical player movement
      if (this.cursors?.up.isDown) {
        this.player.setVelocityY(-speed);
      } else if (this.cursors?.down.isDown) {
        this.player.setVelocityY(speed);
      } else {
        this.player.setVelocityY(0);
      }
    }

    // RECOVER PLAYER PROJECTILES
    this.projectiles.children.each((proj) => {
      const projectile =
        proj as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

      if (projectile.active && projectile.y < 0) {
        this.projectiles.killAndHide(projectile);
        projectile.body.enable = false;
      }

      return true; // Ensure the callback returns a boolean
    });
  }

  fireProjectile = () => {
    const now = this.time.now;
    const cooldown = 150;

    if (now - this.lastFired! > cooldown) {
      this.lastFired = now;

      const projectile: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
        this.projectiles.get(this.player.x, this.player.y);
      if (projectile) {
        projectile.setActive(true);
        projectile.setVisible(true);
        projectile.body.enable = true;
        projectile.body.reset(this.player.x, this.player.y);
        projectile.body.velocity.y = -600;
      }
    } else {
      return;
    }
  };
}
