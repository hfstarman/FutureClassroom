// @ts-check
import { enemies } from "./enemies.js";
import { physicsObjects } from "./objects.js";
import { removeHUD } from "./hud.js";

export const removeGameReferences = () => {
  Object.values(enemies).forEach(enemy => enemy.delete());
  Object.values(physicsObjects).forEach(obj => obj.delete());
  removeHUD();
};