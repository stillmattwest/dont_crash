import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private pad?: Phaser.Input.Gamepad.Gamepad;
  private keyX: Phaser.Input.Keyboard.Key;
  private projectiles: Phaser.Physics.Arcade.Group;
  private lastFired: number = 0;
  private speed: number = 300;
  private laser01_sfx: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    // Add this sprite to the scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Initialize physics properties
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setScale(0.5);

    // Initialize input
    this.cursors = scene!.input.keyboard!.createCursorKeys();
    this.keyX = scene!.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    // Initialize gamepad support
    if (scene.input.gamepad) {
      scene.input.gamepad.once(
        "connected",
        (pad: Phaser.Input.Gamepad.Gamepad) => {
          console.log("gamepad connected");
          this.pad = pad;
        }
      );
    }

    // Initialize projectiles group
    this.projectiles = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      defaultKey: "player_laser_01",
      maxSize: 100,
    });

    // Initialize sound
    this.laser01_sfx = scene.sound.add("laser01_sfx");

    // Create engine animation
    scene.anims.create({
      key: "player_engine",
      frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update(): void {
    // Play engine animation
    this.anims.play("player_engine", true);

    if (this.pad) {
      this.handleGamepadInput();
    } else {
      this.handleKeyboardInput();
    }

    // Recover projectiles
    this.projectiles.children.each((proj) => {
      const projectile =
        proj as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      if (projectile.active && projectile.y < 0) {
        this.projectiles.killAndHide(projectile);
        projectile.body.enable = false;
      }
      return true;
    });
  }

  private handleKeyboardInput(): void {
    // Horizontal movement
    if (this.cursors?.left.isDown) {
      this.setVelocityX(-this.speed);
    } else if (this.cursors?.right.isDown) {
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(0);
    }

    // Vertical movement
    if (this.cursors?.up.isDown) {
      this.setVelocityY(-this.speed);
    } else if (this.cursors?.down.isDown) {
      this.setVelocityY(this.speed);
    } else {
      this.setVelocityY(0);
    }

    // Firing
    if (this.keyX.isDown) {
      this.fireProjectile();
    }
  }

  private handleGamepadInput(): void {
    const leftStickX = this.pad?.axes[0]?.getValue() || 0;
    const leftStickY = this.pad?.axes[1]?.getValue() || 0;
    const deadZone = 0.2;

    let xVelocity = 0;
    let yVelocity = 0;

    if (Math.abs(leftStickX) > deadZone) {
      xVelocity = leftStickX * this.speed;
    }

    if (Math.abs(leftStickY) > deadZone) {
      yVelocity = leftStickY * this.speed;
    }

    if (this.pad?.buttons[0]?.pressed) {
      this.fireProjectile();
    }

    this.setVelocity(xVelocity, yVelocity);
  }

  private fireProjectile(): void {
    const now = this.scene.time.now;
    const cooldown = 150;

    if (now - this.lastFired > cooldown) {
      this.lastFired = now;

      const projectile = this.projectiles.get(
        this.x,
        this.y - 25
      ) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

      if (projectile) {
        this.laser01_sfx.play();
        projectile.setActive(true);
        projectile.setVisible(true);
        projectile.body.enable = true;
        projectile.body.reset(this.x, this.y - 25);
        projectile.body.velocity.y = -700;
      }
    }
  }

  getProjectiles(): Phaser.Physics.Arcade.Group {
    return this.projectiles;
  }
}
