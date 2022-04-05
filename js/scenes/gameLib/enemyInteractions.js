// @ts-check
import { enemies } from "./enemies.js";
import { getLowestY } from "./utils.js";
import { getCtrlrMatrix } from "./controllers.js";
import * as cg from "../../render/core/cg.js";

export const handleEnemyMovement = () => {

  Object.values(enemies).forEach(enemy => {
    gravityEvent(enemy);
    // maybe only move to player if grounded (add field to enemy class)
    turnTowardsPlayer(enemy);
    // moveTowardsPlayer(enemy);
    enemy.applyVelocity();
  })

}

const gravityEvent = (enemy) => {
  if (getLowestY(enemy.entity) + enemy.getDeltaPos()[1] > 0) {
    enemy.accelerantEvent("gravity");
  } else {
    // stop moving down if at ground
    const newVelocity = dropY(enemy.velocity);
    enemy.setVelocity(newVelocity);
  }
}

const moveTowardsPlayer = (enemy) => {
  const playerMatrix = getCtrlrMatrix("right"); // ! change this to the headset later
  const playerPosXZ = dropY(cg.getPos(playerMatrix));
  const enemyPosXZ = dropY(enemy.getPos());
  const prevSpeedXZ = getSpeedXZ(enemy);

  // have enemy travel towards player at some increasing speed to a max speed
  const directionXZ = cg.normalize(cg.vsub(playerPosXZ, enemyPosXZ));
  const newSpeedXZ = Math.min(prevSpeedXZ + (enemy.acceleration * enemy.model.deltaTime), enemy.maxSpeed);

  const newVelocity = cg.scale(directionXZ, newSpeedXZ);

  // Should not change the Y componement of velocity. 
  // Y is handled by gravity. 
  // This function only handles X and Z
  newVelocity[1] = enemy.velocity[1];
  console.log(newVelocity);
  enemy.setVelocity(newVelocity);
}

const getSpeedXZ = (enemy) => {
  const velocity = dropY(enemy.velocity);
  return cg.magnitude(velocity);
}

const dropY = (v) => [v[0], 0, v[2]];

const turnTowardsPlayer = (enemy) => {

}