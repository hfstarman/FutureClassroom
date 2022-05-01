// @ts-check
import { WaveMaker } from "./waveMaker.js";
import { removeTemporaryObjects } from "./objects.js";

let gameHUD = null;

export const createHUD = (model) => {
  if (gameHUD === null) {
    gameHUD = new HUD(model);
    return gameHUD;
  } else {
    throw new Error("HUD already created, use getHUD instead");
  }
}

export const getHUD = () => {
  if (gameHUD === null)
    throw new Error("HUD not created yet, use createHUD instead");
  else
    return gameHUD;
}

export const showHUD = () => {
  getHUD().displayHUD();
}

class HUD {
  constructor(model) {
    this.model = model;
    this.hud = model.add();
    this.score = 0;
    this.wave = 0;
    this.health = 10;
    this.isGameOver = false;
    this.activePowerUp = "None";
    this.powerUpEndTime = 0;

    this.hudLabels = [
      {
        text: "Score: ??",
        field: "score",
        pos: [-1, -1, 0],
      },
      {
        text: "Wave: ??",
        field: "wave",
        pos: [0, -1, 0],
      },
      {
        text: "Health: ??",
        field: "health",
        pos: [1, -1, 0],
      },
      {
        text: "Power Up: ??",
        field: "activePowerUp",
        pos: [0, -1.3, 0],
      }
    ];

    this.hudLabels.forEach(l => this.hud.add('label').move(l.pos).scale(.1));
  }

  setPower(power, duration) {
    this.activePowerUp = power;
    this.powerUpEndTime = this.model.time + duration;
  }

  checkPowerExpiration() {
    if (this.model.time > this.powerUpEndTime) {
      if (this.activePowerUp === "Infinite Throw")
        removeTemporaryObjects();
      this.activePowerUp = "None";
    }
  }

  displayHUD() {
    if (WaveMaker.wonGame())
      this.displayWin();
    else if (!this.isGameOver)
      this.displayStatus();
    else
      this.displayGameOver();
  }

  displayStatus() {
    this.checkPowerExpiration();
    this.hud.setMatrix(this.model.viewMatrix()).move(0,0,-.3).turnY(Math.PI).scale(.1);
    this.hudLabels.forEach((label, i) => {
      const entity = this.hud.child(i);
      entity.info(label.text.replace(/\?\?/, this[label.field]));
    });
  }

  displayGameOver() {
    if (this.hud._children.length > 2) {
      this.hud._children = []; // delete the main hud
      this.hud.add('label').move([0, 0, 0]).scale(1.5).info("Game Over");
      this.hud.add('label').move([0, -2.5, 0]).scale(1.5).info("Score: " + this.score);
    }
    this.hud.setMatrix(this.model.viewMatrix()).move(0,0,-1).turnY(Math.PI).scale(.1);
  }

  displayWin() {
    if (this.hud._children.length > 2) {
      this.hud._children = []; // delete the main hud
      this.hud.add('label').move([0, 0, 0]).scale(1.5).info("YOU WIN!");
      this.hud.add('label').move([0, -2.5, 0]).scale(.5).info("Score: " + this.score);
    }
    this.hud.setMatrix(this.model.viewMatrix()).move(0,0,-1).turnY(Math.PI).scale(.1);
  }

  increaseHealth(amount) {
    this.health += amount;
  }

  decreaseHealth(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) this.isGameOver = true;
  }

  increaseScore(amount) {
    this.score += amount;
  }

  incrementWave() {
    return ++this.wave;
  }

}
