// @ts-check
import * as cg from "../../render/core/cg.js";
import { getCtrlrMatrix } from "./controllers.js";
import { objectCollection } from "./objects.js";
import { state } from "./objects.js";
import { GameObject } from "./objects.js";

export const mHitObject = (matrix) => {
  let hit = null;
  for (let object of objectCollection) {
    if (cg.mHitRect(object.getMatrix(), matrix)) {
      hit = object;
      break;
    }
  }

  return hit;
}

export const handleObjectMovement = () => {
  for (let obj of objectCollection) {
    switch (obj.state) {
      case state.held:
        handleHeldObject(obj);
        break;
      case state.stored:
        handleStoredObject(obj);
        break;
      case state.free:
        applyPhysicsToObject(obj);
        break;
      default:
        throw new Error(`Invalid object state: ${obj.state}`);
    }
  }
}

const handleHeldObject = (obj) => {
  obj.prevPos = obj.getPos();
  // stick the object to the controller
  const CM = getCtrlrMatrix(obj.handHeldIn);
  obj.setMatrix(CM).move(0, -.14, -.15).turnX(Math.PI/4).scale(.1, .1, .1);
  // set velocity to allowing for throwing when released
  obj.setVelocity(cg.vsub(obj.getPos(), obj.prevPos));
}

const handleStoredObject = (obj) => {
  throw new Error("Not implemented");
}

const applyPhysicsToObject = (obj) => {
  // apply gravity, friction, and restitution
  if (cg.getHeight(obj.getMatrix()) + (.3/2) + obj.velocity[1] <= 1) {
    obj.accelerantEvent("bounce");
    obj.accelerantEvent("friction");
  } else {
    obj.accelerantEvent("gravity");
  }

  obj.applyVelocity();
}

const grabDistance = 0.3;
const grabbedObjects = {
  left: null,
  right: null
}

/**
 * Sets fields and variables related to grabbing an object
 * @param {GameObject} obj The object being grabbed
 * @param {string} hand 'left' or 'right'
 */
const grabObject = (obj, hand) => {
  obj.state = state.held;
  obj.handHeldIn = hand;
  grabbedObjects[hand] = obj;
}

/**
 * Attempts to grab an object
 * @param {string} hand 'right' or 'left'
 */
export const tryGrab = (hand) => {
  if (grabbedObjects[hand] !== null) return; // one hand cannot grab two objects
  const CM = getCtrlrMatrix(hand);
  let closestObj = null;
  let closestDist = null;
  for (let obj of objectCollection) {
    let sqDistance = cg.vSqDistance(obj.getPos(), cg.getPos(CM));
    if (sqDistance < grabDistance * grabDistance) {
      if (closestObj === null || sqDistance < closestDist) {
        closestObj = obj;
        closestDist = sqDistance;
      }
    }
  }
  
  if (closestObj !== null) {
    grabObject(closestObj, hand);
  }
}

export const releaseGrab = (hand) => {
  const grabbedObj = grabbedObjects[hand];
  if (grabbedObj !== null) {
    grabbedObj.state = state.free;
    grabbedObjects[hand] = null;
  }
}