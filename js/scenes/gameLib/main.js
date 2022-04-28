// @ts-check
import { handleControllerActions } from "./controllers.js";
import { handleEnemyMovement } from "./enemyInteractions.js";
import { handleObjectMovement, setObjectColors} from "./objectInteractions.js";
import { handleCollisions } from "./collisions.js";
import { createHUD, showHUD, getHUD } from "./hud.js";
import { handleEnemyAttack } from "./enemyAttack.js";
import { WaveMaker } from "./waveMaker.js";

export function initGame(model, waveSpawns) {
  createHUD(model);
  WaveMaker.init(model, waveSpawns);
}

export function runGame() {
  showHUD();
  if (getHUD().isGameOver) return;

  setObjectColors();
  handleCollisions();
  handleEnemyAttack();
  WaveMaker.makeWaves();
  handleEnemyMovement();
  handleObjectMovement();
  handleControllerActions();
}
