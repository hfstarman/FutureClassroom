// @ts-check
import * as cg from "../../render/core/cg.js";
import { getCtrlrMatrix } from "./controllers.js";
import { physicsObjects } from "./objects.js";
import { state } from "./objects.js";
import { GameObject } from "./objects.js";
import { lcb, rcb } from "../../handle_scenes.js";
import { solveBallisticArc } from "../../util/math.js";
import c from "./colors.js";
import { getLowestY } from "./utils.js";

const grabDistance = 0.3;

const grabbedObjects = {
  left: null,
  right: null
}

const hoveredObjects = {
  left: null,
  right: null
}

const selectedObjects = {
  left: null,
  right: null
}

export const mHitObject = (matrix) => {
  let hit = null;
  for (let object of Object.values(physicsObjects)) {
    if (cg.mHitRect(object.getMatrix(), matrix)) {
      hit = object;
      break;
    }
  }

  return hit;
}

/**
 * Returns the GameObject that the given controller is targeting. If no object is targeted, returns null.
 * @param {string} hand 'left' or 'right'
 * @returns {GameObject} the closest object targted by the controller
 */
export const getTargetedObject = (hand) => {
  const beam = hand === "left" ? lcb : rcb;
  const ctrlrPos = cg.getPos(getCtrlrMatrix(hand));
  let hit = null;
  let closestDist = Infinity;
  for (let obj of Object.values(physicsObjects)) {
    if (obj.state === state.free && didIntersect(beam, obj)) {
      const dist = cg.vSqDistance(ctrlrPos, obj.getPos());
      if (dist < closestDist) {
        hit = obj;
        closestDist = dist;
      }
    }
  }

  return hit;
}

const didIntersect = (beam, obj) => {
  return obj.entity._children.reduce((res, child) => (
    res || beam.hitPrism(child.getGlobalMatrix())
  ), false);
}

export const handleObjectMovement = () => {
  for (let obj of Object.values(physicsObjects)) {
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
  // obj.setMatrix(CM).move(0, -.14, -.15).turnX(Math.PI/4);
  obj.setMatrix(CM).move(0, -.12, -.13).turnX(-Math.PI/4).turnY(Math.PI/2);
  // set velocity to allowing for throwing when released
  const deltaPos = cg.vsub(obj.getPos(), obj.prevPos);
  obj.setVelocity(cg.scale(deltaPos, 1/obj.model.deltaTime));
}

const handleStoredObject = (obj) => {
  throw new Error("Not implemented");
}

const applyPhysicsToObject = (obj) => {
  // apply gravity, friction, and restitution
  if (getLowestY(obj.entity) + obj.getDeltaPos()[1] <= .7366) { // .7366 meters because I want it to be on the table (29 inches)
    obj.accelerantEvent("bounce");
    obj.accelerantEvent("friction");
  } else {
    obj.accelerantEvent("gravity");
  }

  obj.applyVelocity();
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
  for (let obj of Object.values(physicsObjects)) {
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

/**
 * Attempts to perform an alyx grab. Is only able to perform
 * it if there is an object selected by given hand.
 * @param {string} hand 'left' or 'right'
 */
export const tryAlyxGrab = (hand) => {
    const obj = selectedObjects[hand];
    if (obj === null) return;
    removeSelected(hand);
    
    const targetPos = cg.getPos(obj.getMatrix());
    const controllerPos = cg.getPos(getCtrlrMatrix(hand));

    let sol = [];
    let speed = .1;
    while (sol.length == 0 && speed < .3) {
       sol = solveBallisticArc(targetPos, speed, controllerPos, obj.gravity);
       speed += .02;
    }
    console.log("solution:")
    console.log(sol)
    if (sol.length > 0) obj.setVelocity(sol[1]);
}

// Can optimize by only resetting colors of objects that were changed
export const resetAllObjectColors = () => {
  for (let obj of Object.values(physicsObjects))
    obj.entity.color(obj.defaultColor);
}

export const setObjectColors = () => {
  for (let obj of Object.values(physicsObjects)) {
    if (obj.selectedBy !== null)
      obj.entity.color(obj.selectColor);
    else if (obj.hoveredBy !== null)
      obj.entity.color(obj.hoverColor);
    else
      obj.entity.color(obj.defaultColor);
  }
}

/**
 * Sets appropriate variables when an object is hovered over
 * @param {GameObject} obj The game object to mark
 * @param {string} hand 'left' or 'right'
 */
export const markHovered = (obj, hand) => {
  removeHovered(hand);
  obj.hoveredBy = hand;
  hoveredObjects[hand] = obj;
}

/**
 * Resets the variables related to hovering over an object
 * @param {string} hand 'left' or 'right'
 */
export const removeHovered = (hand) => {
  if (hoveredObjects[hand] !== null) {
    hoveredObjects[hand].hoveredBy = null;
    hoveredObjects[hand] = null;
  }
}

/**
 * Sets appropriate variables when an object is selected
 * @param {GameObject} obj The object being selected
 * @param {string} hand 'left' or 'right'
 */
export const markSelected = (obj, hand) => {
  removeSelected(hand);
  obj.selectedBy = hand;
  selectedObjects[hand] = obj;
}

/**
 * Resets the variables related to selecting an object
 * @param {string} hand 'left' or 'right'
 */
export const removeSelected = (hand) => {
  if (selectedObjects[hand] !== null) {
    selectedObjects[hand].selectedBy = null;
    selectedObjects[hand] = null;
  }
}