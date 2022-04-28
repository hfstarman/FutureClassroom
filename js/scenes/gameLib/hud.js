// @ts-check

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
    ];

    this.hudLabels.forEach(l => this.hud.add('label').move(l.pos).scale(.1));
  }

  displayHUD() {
    if (!this.isGameOver)
      this.displayStatus();
    else
      this.displayGameOver();
  }

  displayStatus() {
    this.hud.setMatrix(this.model.viewMatrix()).move(0,0,-.3).turnY(Math.PI).scale(.1);
    this.hudLabels.forEach((label, i) => {
      const entity = this.hud.child(i);
      entity.info(label.text.replace(/\?\?/, this[label.field]));
    });
  }

  displayGameOver() {
    if (this.hud._children.length > 1) {
      this.hud._children = []; // delete the main hud
      this.hud.add('label').move([0, 0, 0]).scale(1.5).info("Game Over");
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

// class HUD {
//   // ! turn this into a static class
//   static model = null;
//   static hud = null;
//   static score = 0;
//   static wave = 0;
//   static health = 10;
//   static isGameOver = false;
//   static currentHUD = "";

//   static playerHudLabels = [
//     {
//       text: "Score: ??",
//       field: "score",
//       pos: [-1, -1, 0],
//     },
//     {
//       text: "Wave: ??",
//       field: "wave",
//       pos: [0, -1, 0],
//     },
//     {
//       text: "Health: ??",
//       field: "health",
//       pos: [1, -1, 0],
//     },
//   ];

//   static gameOverLabels = [
//     {
//       text: "Game Over",
//       pos: [0, 0, 0],
//       size: 1,
//     }
//   ]

//   static waveChangeLabels = [
//     {
//       text: "Wave: ??",
//       field: "wave",
//       pos: [0, 0, 0],
//       size: 1,
//     }
//   ]

//   static init(model) {
//     HUD.model = model;
//     HUD.hud = model.add();
//   }

//   static createPlayerHUD() {
//     HUD.currentHUD = "player";
//     HUD.playerHudLabels.forEach(l => this.hud.add('label').move(l.pos).scale(.1));
//   }

//   static createGameOverHUD() {
//     HUD.currentHUD = "gameOver";
//     HUD.gameOverLabels.forEach(l => this.hud.add('label').move(l.pos).scale(l.size));
//   }

//   static createWaveChangeHUD() {
//     HUD.currentHUD = "waveChange";
//     HUD.waveChangeLabels.forEach(l => this.hud.add('label').move(l.pos).scale(l.size));
//   }

//   static showPlayerHUD() {
//     if (HUD.currentHUD === "player") return;
//     HUD.removeCurrentHUD();
//     HUD.createPlayerHUD();
//   }

//   static showGameOver() {
//     if (HUD.currentHUD === "gameOver") return;
//     HUD.removeCurrentHUD();
//     HUD.createGameOverHUD();
//   }

//   static showWaveChange() {
//     if (HUD.currentHUD === "waveChange") return;
//     HUD.removeCurrentHUD();
//     HUD.createWaveChangeHUD();
//   }

//   static removeCurrentHUD() {
//     HUD.hud._children = [];
//   }

//   static displayHUD() {
//     if (!HUD.isGameOver)
//       HUD.displayStatus();
//     else
//       HUD.displayGameOver();
//   }

//   static displayStatus() {
//     HUD.hud.setMatrix(HUD.model.viewMatrix()).move(0,0,-.3).turnY(Math.PI).scale(.1);
//     HUD.playerHudLabels.forEach((label, i) => {
//       const entity = HUD.hud.child(i);
//       entity.info(label.text.replace(/\?\?/, HUD[label.field]));
//     });
//   }

//   static displayGameOver() {
//     if (HUD.hud._children.length > 1) {
//       HUD.hud._children = []; // delete the main hud
//       HUD.hud.add('label').move([0, 0, 0]).scale(1.5).info("Game Over");
//     }
//     HUD.hud.setMatrix(HUD.model.viewMatrix()).move(0,0,-1).turnY(Math.PI).scale(.1);
//   }

//   static increaseHealth(amount) {
//     HUD.health += amount;
//   }

//   static decreaseHealth(amount) {
//     HUD.health = Math.max(0, HUD.health - amount);
//     if (HUD.health === 0) HUD.isGameOver = true;
//   }

//   static increaseScore(amount) {
//     HUD.score += amount;
//   }

//   static incrementWave() {
//     return ++HUD.wave;
//   }

// }
