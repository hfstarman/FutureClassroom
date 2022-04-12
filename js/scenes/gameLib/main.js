// @ts-check
import { handleControllerActions } from "./controllers.js";
import { handleEnemyMovement } from "./enemyInteractions.js";
import { handleObjectMovement, setObjectColors} from "./objectInteractions.js";
import { handleCollisions } from "./collisions.js";

export default function runGame() {
  setObjectColors();
  handleCollisions();
  handleEnemyMovement();
  handleObjectMovement();
  handleControllerActions();
}
