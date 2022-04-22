// @ts-check
import { handleControllerActions } from "./controllers.js";
import { handleEnemyMovement } from "./enemyInteractions.js";
import { handleObjectMovement, setObjectColors} from "./objectInteractions.js";
import { handleCollisions } from "./collisions.js";
import { createHUD, showHUD } from "./hud.js";

export function initGame(model) {
  createHUD(model);
}

export function runGame() {
  showHUD();
  setObjectColors();
  handleCollisions();
  handleEnemyMovement();
  handleObjectMovement();
  handleControllerActions();
}
