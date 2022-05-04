// @ts-check
import { handleControllerActions } from "./controllers.js";
import { handleEnemyMovement } from "./enemyInteractions.js";
import { handleObjectMovement, setObjectColors, animateObjects} from "./objectInteractions.js";
import { handleCollisions } from "./collisions.js";
import { createHUD, showHUD, getHUD } from "./hud.js";
import { handleEnemyAttack } from "./enemyAttack.js";
import { WaveMaker } from "./waveMaker.js";

export function initGame(model, waveSpawns, isDemo) {
  console.log("init game");
  model.setTable(false);
  createHUD(model);
  getHUD().setDemo(isDemo);
  WaveMaker.init(model, waveSpawns);
}

export function runGame() {
  showHUD();
  if (getHUD().isGameDone()) return;

  animateObjects();
  setObjectColors();
  handleCollisions();
  handleEnemyAttack();
  WaveMaker.makeWaves();
  handleEnemyMovement();
  handleObjectMovement();
  handleControllerActions();
}
