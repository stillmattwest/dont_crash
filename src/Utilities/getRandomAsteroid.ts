import Phaser from "phaser";

export class AsteroidUtils {
  private static asteroidArray = [
    "gray_asteroid_lg_01",
    "gray_asteroid_lg_02",
    "gray_asteroid_lg_03",
    "red_asteroid_lg_01",
    "red_asteroid_lg_02",
    "red_asteroid_lg_03",
  ];

  public static getRandomAsteroid = () => {
    return Phaser.Math.RND.pick(AsteroidUtils.asteroidArray);
  };

  public static getAsteroidSpin = () => {
    return Phaser.Math.RND.between(1, 5);
  };
}
