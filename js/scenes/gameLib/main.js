// @ts-check
import { handleControllerActions } from "./controllers.js";
import { handleEnemyMovement } from "./enemyInteractions.js";
import { handleObjectMovement, setObjectColors} from "./objectInteractions.js";
import { handleCollisions } from "./collisions.js";
import { createHUD, showHUD, getHUD } from "./hud.js";
import { handleEnemyAttack } from "./enemyAttack.js";

export function initGame(model) {
  createHUD(model);
}

export function runGame() {
  showHUD();
  if (getHUD().isGameOver) return;
  
  setObjectColors();
  handleCollisions();
  handleEnemyAttack();
  handleEnemyMovement();
  handleObjectMovement();
  handleControllerActions();
}
