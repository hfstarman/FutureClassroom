// @ts-check
import { enemies, getLiveEnemies } from "./enemies.js";
import { getLowestY } from "./utils.js";
import * as cg from "../../render/core/cg.js";

export const handleEnemyMovement = () => {

  getLiveEnemies().forEach(enemy => {
    if (!enemy.grounded) {
      gravityEvent(enemy);
    } else {
      // moveTowardsPlayer(enemy);
      // walkingAnimation(enemy);
    }
    turnTowardsPlayer(enemy);
    enemy.applyVelocity();
  })

}

const gravityEvent = (enemy) => {
  if (getLowestY(enemy.entity) + enemy.getDeltaPos()[1] > 0) {
    enemy.accelerantEvent("gravity");
  } else {
    // stop moving down if at ground
    enemy.grounded = true;
    const newVelocity = dropY(enemy.velocity);
    enemy.setVelocity(newVelocity);
  }
}

const walkingAnimation = (enemy) => {
  // the animation is a sinusoidal wave
  // that is scaled by the speed of the enemy
  const speed = /*getSpeedXZ(enemy)*/ enemy.maxSpeed * (1/enemy.strideLength) * Math.PI;
    // console.log(speed);
  // console.log(speed);

  // get the current radians
  // then add delta radians
  // set 

  const maxRadians = enemy.strideAngle;
  // const temp = speed * enemy.model.time;
  // console.log(getLocalTurnX(enemy.legJointL) * (180/Math.PI));
  // let currentAngle = getLocalTurnX(enemy.legJointL);
  // currentAngle = Math.asin(currentAngle / maxRadians);

  // const deltaAngle = (speed * enemy.model.deltaTime);
  // console.log(deltaAngle)
  // let newAngle = currentAngle + deltaAngle;
  // newAngle -= newAngle > Math.PI * 2 ? Math.PI * 2 : 0;
  // const radians = newAngle * maxRadians;
  // const radians = Math.sin(newAngle) * maxRadians;
  const radians = Math.sin(speed * enemy.model.time) * maxRadians;
  const jointLPos = cg.getPos(enemy.legJointL.getMatrix());
  const jointRPos = cg.getPos(enemy.legJointR.getMatrix());
  enemy.legJointL.identity().move(jointLPos).turnX(radians);
  enemy.legJointR.identity().move(jointRPos).turnX(-radians);
}

const moveTowardsPlayer = (enemy) => {
  const playerMatrix = enemy.model.viewMatrix(0);
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
  enemy.setVelocity(newVelocity);
}

const getSpeedXZ = (enemy) => {
  const velocity = dropY(enemy.velocity);
  return cg.magnitude(velocity);
}

const dropY = (v) => [v[0], 0, v[2]];

const turnTowardsPlayer = (enemy) => {
  // get direction to player
  const playerMatrix = enemy.model.viewMatrix(0);
  const playerPosXZ = dropY(cg.getPos(playerMatrix));
  const enemyPosXZ = dropY(enemy.getPos());
  const directionXZ = cg.normalize(cg.vsub(playerPosXZ, enemyPosXZ));
  
  // get rotation of enemy in world space
  let worldTurnY = getWorldTurnY(enemy.entity);
  // convert direction towards player to angle in radians
  const theta = Math.atan2(directionXZ[0], directionXZ[2]);

  enemy.entity.turnY(theta - worldTurnY);
}

const getLocalTurnX = (entity) => {
  const entityMatrix = entity.getMatrix();
  const r1 = entityMatrix[9];
  const r2 = entityMatrix[10];
  return Math.atan2(r1, r2); 
}

const getWorldTurnY = (entity) => {
  const entityMatrix = entity.getGlobalMatrix();
  const r1 = entityMatrix[8];
  const r2 = entityMatrix[10];
  return Math.atan2(r1, r2);
}
