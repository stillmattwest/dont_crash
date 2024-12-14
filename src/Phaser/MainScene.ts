import Phaser from "phaser";
import { calculateBgScale } from "../Utilities/calculateBGScale";

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private pad?: Phaser.Input.Gamepad.Gamepad;
  private nebula01: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({
      key: "MainScene",
    });
  }

  preload() {
    this.load.image("starField", "assets/starField/bg_space_seamless.png");
    this.load.image("player", "assets/player/Blue_Player_Ship_2.png");
    this.load.image("nebula_01.png", "assets/nebula/nebula2.png");
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

    // add nebula parallax layer 1
    let nebula_01 = this.add.image(0, 0, "nebula_01");
    const neb_01_scale = calculateBgScale(
      nebula_01.width,
      nebula_01.height,
      this.scale.width,
      this.scale.height
    );
    nebula_01.setScale(neb_01_scale);
    nebula_01.setOrigin(0, 0);
    nebula_01.setPosition(0, 0);

    // second layer for parallax
    let nebula_02 = this.add.image(0, 0, "nebula_01");
    // const neb_02_scale = calculateBgScale(
    //   nebula_02.width,
    //   nebula_02.height,
    //   this.scale.width,
    //   this.scale.height
    // );
    // nebula_02.setScale(neb_01_scale);
    // nebula_02.setOrigin(0, 0);
    // nebula_02.setPosition(0, 0);

    // add player with physics
    this.player = this.physics.add.sprite(600, 400, "player");
    this.player.setScale(0.5);

    // set player physics properties
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // setup cursor keys
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // setup gamepads
    this.input.gamepad?.once(
      "connected",
      (pad: Phaser.Input.Gamepad.Gamepad) => {
        console.log(`gamepad connected`);
        this.pad = pad;
      }
    );
  }

  update() {
    const speed = 300;
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

      // Set the velocity of the player ship
      this.player.setVelocity(xVelocity, yVelocity);
    } else {
      // No gamepad connected; stop the ship or handle fallback input
      this.player.setVelocity(0, 0);
    }

    // Example of button handling (e.g., firing a weapon on button press)
    if (this.pad?.buttons[0]?.pressed) {
      console.log("Button 0 pressed!");
      // Trigger an action (like firing a weapon) here
    }
  }
}
