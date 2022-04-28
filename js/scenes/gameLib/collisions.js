// @ts-check
import * as cg from "../../render/core/cg.js";
import { enemies } from "./enemies.js";
import { physicsObjects } from "./objects.js";
import { getHUD } from "./hud.js";

export const handleCollisions = () => {
  const movingObjects = Object.values(physicsObjects).filter(
    () => true //obj => obj.state === "free" && isMoving(obj)
  );
  const deadlyMovingObjects = movingObjects.filter(obj => obj.isDeadly);
  const enemiesArr = Object.values(enemies).filter(e => e.state === "alive");
  
  let closestSqDist = Infinity;
  let closestEnemyHit = null;
  let murderWeapon = null;
  for (let obj of deadlyMovingObjects) {
    for (let enemy of enemiesArr) {
      let sqDist = checkCollision(obj, enemy);
      if (sqDist !== null && sqDist < closestSqDist) {
        closestSqDist = sqDist;
        closestEnemyHit = enemy;
        murderWeapon = obj;
      }
    }
  }

  if (closestEnemyHit !== null) {
    closestEnemyHit.death();
    getHUD().increaseScore(100);
    murderWeapon.resetVelocity();
    // murderWeapon.selectedBy = "right"; //! DEBUGGING
    // set obj velocity to zero
    // set enemy state to dead
    // trigger enemy death animation
    // remove enemy from enemies
  // } else {
  //   // ! DEBUGGING, REMOVE THIS
  //   const knife = physicsObjects["2"];
  //   knife.selectedBy = null;
  }
}

// filter out the objects that are not free or not moving
const checkCollision = (obj, enemy) => {
  const objHitboxes = getHitboxes(obj);
  const enemyHitboxes = getHitboxes(enemy);

  let closestSqDist = Infinity;
  for (let objHB of objHitboxes) {
    let objPos = objHB.posAbsolute;
    let objRadius = objHB.radius;

    for (let enemyHB of enemyHitboxes) {
      let enemyPos = enemyHB.posAbsolute;
      let enemyRadius = enemyHB.radius;
      let totalRadius = objRadius + enemyRadius;

      let sqDistance = cg.vSqDistance(objPos, enemyPos);
      if (sqDistance < totalRadius * totalRadius) {
        if (sqDistance < closestSqDist) {
          closestSqDist = sqDistance;
        }
      }
    }
  }

  return closestSqDist !== Infinity ? closestSqDist : null;
}

const getHitboxes = (obj) => {
  // return an array of (absolutePosition, radius) pairs
  const hitboxes = [];
  Object.entries(obj.hitboxes).forEach(([name, value]) => {
    const baseMatrix = obj[name].getGlobalMatrix();
    value.forEach(({ posOffset, radius }) => {
      const hitboxMatrix = cg.mMultiply(baseMatrix, cg.mTranslate(posOffset));
      const posAbsolute = cg.getPos(hitboxMatrix);
      hitboxes.push({posAbsolute, radius});
    });
  });
  return hitboxes;
}

const isMoving = (obj) => {
  const ep = 0.001;
  const velocity = obj.velocity;
  return Math.abs(velocity[0]) > ep || 
         Math.abs(velocity[1]) > ep || 
         Math.abs(velocity[2]) > ep;
}