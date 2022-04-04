// @ts-check
import { handleControllerActions } from "./controllers.js";
import { handleEnemyMovement } from "./enemyInteractions.js";
import { handleObjectMovement, setObjectColors} from "./objectInteractions.js";

export default function runGame() {
  setObjectColors();
  handleEnemyMovement();
  handleObjectMovement();
  handleControllerActions();
}

// handleCollisions();