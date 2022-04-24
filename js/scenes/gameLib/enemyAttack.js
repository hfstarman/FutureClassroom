import * as cg from "../../render/core/cg.js";
import { enemies } from "./enemies.js";
import { getHUD } from "./hud.js";

// enemy.model.viewMatrix() -> headset view matrix

export const handleEnemyAttack = () => {
  Object.values(enemies).forEach(enemy => {
    if (enemy.state === "alive") {
      if (canEnemyAttackPlayer(enemy)) {
        getHUD().decreaseHealth(enemy.damage);
        enemy.death();
      }
    }
  });
}

const canEnemyAttackPlayer = (enemy) => {
  const playerMatrix = enemy.model.viewMatrix();
  const playerPosXZ = cg.dropY(cg.getPos(playerMatrix));
  const enemyPosXZ = cg.dropY(cg.getPos(enemy.entity.getMatrix()));
  const distance = cg.vSqDistance(playerPosXZ, enemyPosXZ);
  return distance < enemy.attackRange * enemy.attackRange;

}