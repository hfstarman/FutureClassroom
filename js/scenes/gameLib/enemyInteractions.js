// @ts-check
import { enemies } from "./enemies.js";
import { getLowestY } from "./utils.js";

export const handleEnemyMovement = () => {

  Object.values(enemies).forEach(enemy => {
    if (getLowestY(enemy.entity) + enemy.velocity[1] > 0) {
      console.log("GRAVITY");
      enemy.accelerantEvent("gravity");
    } else {
      // stop moving down if at ground
      const newVelocity = enemy.velocity;
      newVelocity[1] = 0;
      enemy.setVelocity(newVelocity);
    }
    
    enemy.applyVelocity();
  })
  
}