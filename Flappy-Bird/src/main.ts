import "./style.css";
import Phaser, { Time } from "phaser";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
    },
    debug: false,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// bird and other variable definition

let bird: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
let obstacles: Phaser.Physics.Arcade.StaticGroup;
let cloudsWhite: Phaser.GameObjects.TileSprite;
let cloudsWhiteSmall: Phaser.GameObjects.TileSprite;
let movingGround: Phaser.GameObjects.TileSprite;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let score = 0;
let gameOver = false;
let scoreText: Phaser.GameObjects.Text;

let game = new Phaser.Game(config);
let nextSpawn = 0;
let timeEvent;

function preload(this: Phaser.Scene) {
  // console.log(this);
  // this = scene:Object

  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("large-cloud", "assets/clouds-white.png");
  this.load.image("small-cloud", "assets/clouds-white-small.png");
  // our bird (list of two frames)
  this.load.image({ key: "bird", url: "assets/fly/frame-1.png" });
}

function create(this: Phaser.Scene) {
  // timeEvent = game.time.events.add(Phaser.Timer.SECOND * 3, callback, this);

  // a simple background
  this.add.image(400, 300, "sky");
  // some clouds
  cloudsWhite = this.add.tileSprite(400, 100, 800, 200, "large-cloud");
  cloudsWhiteSmall = this.add.tileSprite(400, 100, 800, 200, "small-cloud");

  // ground as tileSprite
  movingGround = this.add.tileSprite(400, 600, 800, 50, "ground");

  obstacles = this.physics.add.staticGroup();

  for (let i = 0; i < 5; i++) {
    let obstacle = obstacles

      .create(Math.random() * 800, 600, "ground")
      .setOrigin(1, 1)
      .setScale(0.1, Math.random() * 10);

    // obstacle.body.setImmovable(true);
  }

  // Here is our bird and its settings
  bird = this.physics.add.sprite(400, 150, "bird").setScale(0.1);

  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  // input events

  cursors = this.input.keyboard.createCursorKeys();

  // The score

  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    color: "#0000",
  });
  // Collide the bird with the platform
  this.physics.add.collider(bird, movingGround);
  this.physics.add.collider(bird, obstacles);
  console.log(bird);
}

function update(this: Phaser.Scene) {
  cloudsWhite.tilePositionX += 0.5;
  cloudsWhiteSmall.tilePositionX += 0.25;

  movingGround.tilePositionX += 0.25;

  // bird.setVelocityX(100);

  if (gameOver) {
    return;
  }
  if (cursors.space.isDown || cursors.up.isDown) {
    bird.setVelocityY(-330);
  }

  obstacles.children.iterate(function (obstacle) {
    if (obstacle.x > game.config.width) {
      obstacle.destroy();
    }
    // console.log(obstacle);

    obstacle.x -= 0.25;
  });

  if (game.getTime() > nextSpawn) {
    let obstacle = obstacles
      .create(Math.random() * 200 + 700, 600, "ground")
      .setOrigin(1, 1)
      .setScale(0.1, Math.random() * 10);

    obstacle.body.velocity.x = 10;

    // randomly schedule the next obstacle spawn, which will happen between 0 to 1 seconds after the current time.
    nextSpawn = game.getTime() + Math.random() * 2000;
  }
  // console.log(nextSpawn);
}
