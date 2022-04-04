// @ts-check
import { handleControllerActions } from "./controllers.js";
import { handleObjectMovement, setObjectColors} from "./objectInteractions.js";

export default function runGame() {
  setObjectColors();
  handleObjectMovement();
  handleControllerActions();
}

// handleCollisions();