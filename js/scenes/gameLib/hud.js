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
  getHUD().animate();
}

class HUD {
  constructor(model) {
    this.model = model;
    this.hud = model.add();
    this.score = 0;
    this.wave = 1;
    this.health = 10;

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

  animate() {
    this.hud.setMatrix(this.model.viewMatrix()).move(0,0,-.3).turnY(Math.PI).scale(.1);
    this.hudLabels.forEach((label, i) => {
      const entity = this.hud.child(i);
      entity.info(label.text.replace(/\?\?/, this[label.field]));
    });
  }
}

// class Player {
//   constructor() {
//     this.health = 10;
//     this.score = 0;
//     this.wave = 1;

//     this.powerups = null; // powerup
//   }

//   incrementWave() {
//     this.wave++;
//   }

//   markKill(type) {
//     switch (type) {
//       case "zombie":
//         this.score += 10;
//         break;
//       default:
//         break;
//     }
//   }
  
// }

// const player = new Player();
// export default player;

// export const handleHUD = () => {
//   // animate

// }


// import { lcb, rcb } from '../handle_scenes.js';

// export const init = async model => {
//    let isAnimate = 0, isItalic = 0, isClear = 0;
//    model.control('a', 'animate', () => isAnimate = ! isAnimate);
//    model.control('c', 'clear'  , () => isClear   = ! isClear  );
//    model.control('i', 'italic' , () => isItalic  = ! isItalic );

//    let text = `Now is the time   \nfor all good men  \nto come to the aid\nof their party.   ` .split('\n');

//    let label = model.add();

//    for (let line = 0 ; line < text.length ; line++)
//       label.add('label').move(0,-line,0).scale(.5);

//    model.animate(() => {
//       label.setMatrix(model.viewMatrix()).move(0,0,-1).turnY(Math.PI).scale(.1);
//       label.flag('uTransparentTexture', isClear);
//       for (let line = 0 ; line < text.length ; line++) {
//          let obj = label.child(line);
//          obj.info((isItalic ? '<i>' : '') + text[line])
// 	    .color(lcb.hitLabel(obj) ? [1,.5,.5] :
// 	           rcb.hitLabel(obj) ? [.3,1,1] : [1,1,1]);
//       }
//    });
// }