// @ts-check
import * as cg from "../../render/core/cg.js";
import { controllerMatrix, buttonState } from "../../render/core/controllerInput.js";
import * as t from "./types.js";
import { 
  tryGrab, 
  releaseGrab, 
  getTargetedObject, 
  markHovered,
  removeHovered,
  markSelected,
  removeSelected,
  tryAlyxGrab
} from "./objectInteractions.js";
import { debugLog } from "./debug.js";

export const handleControllerActions = () => {
  updateButtonInfo();
  Wrists.updatePos();

  let hitL = getTargetedObject("left");
  let hitR = getTargetedObject("right");


  if (hitR !== null) {
    markHovered(hitR, "right");
    if (buttonWentDown("triggerR"))
      markSelected(hitR, "right");
  } else {
    removeHovered("right");
  }

  if (hitL !== null) {
    markHovered(hitL, "left");
    if (buttonWentDown("triggerL"))
      markSelected(hitL, "left");
  } else {
    removeHovered("left");
  }

  if (buttonWentDown("B")) debugLog();

  if (Wrists.didFlick("right")) tryAlyxGrab("right");
  if (Wrists.didFlick("left")) tryAlyxGrab("left");

  if (buttonWentDown("trigger2R")) tryGrab("right");
  if (buttonWentDown("trigger2L")) tryGrab("left");
  if (buttonWentUp("trigger2R")) releaseGrab("right");
  if (buttonWentUp("trigger2L")) releaseGrab("left");

  // releasing selected objects
  if (buttonWentUp("triggerR")) removeSelected("right");
  if (buttonWentUp("triggerL")) removeSelected("left");
}

// left[0] = triggerL
// left[1] = trigger2L
// left[2] = ?
// left[3] = joyBtnL
// left[4] = X
// left[5] = Y
// left[6] = menuL maybe?

// right[0] = triggerR
// right[1] = trigger2R
// right[2] = ?
// right[3] = btnJoyR
// right[4] = A
// right[5] = B
// right[6] = menuR maybe?


let buttonInfo = {};
let init = false;
(function initButtonInfo() {
  if (init) return;
  init = true;
  console.log("init button info");
  
  buttonInfo = {

    "triggerL" : { hand: "left",  button: 0, pressed: false, prevPressed: false },
    "trigger2L": { hand: "left",  button: 1, pressed: false, prevPressed: false },
    "joyBtnL"  : { hand: "left",  button: 3, pressed: false, prevPressed: false },
    "X"        : { hand: "left",  button: 4, pressed: false, prevPressed: false },
    "Y"        : { hand: "left",  button: 5, pressed: false, prevPressed: false },
  
    "triggerR" : { hand: "right", button: 0, pressed: false, prevPressed: false },
    "trigger2R": { hand: "right", button: 1, pressed: false, prevPressed: false },
    "btnJoyR"  : { hand: "right", button: 3, pressed: false, prevPressed: false },
    "A":         { hand: "right", button: 4, pressed: false, prevPressed: false },
    "B":         { hand: "right", button: 5, pressed: false, prevPressed: false },
  
  }

})();

const getButtonState = (info) => buttonState[info.hand][info.button];

const updateButtonInfo = () => {
  for (let key in buttonInfo) {
    let info = buttonInfo[key];
    info.prevPressed = info.pressed;
    info.pressed = getButtonState(info).pressed;
  }
}

/**
 * @param {string} button The name of the button
 * @returns a boolean indicating whether the button was released this frame
 */
export const buttonWentDown = (button) => {
  const info = buttonInfo[button];
  return info.pressed && !info.prevPressed;
}

/**
 * @param {string} button The name of the button
 * @returns a boolean indicating whether the button was pressed this frame
 */
export const buttonWentUp = (button) => {
  const info = buttonInfo[button];
  return !info.pressed && info.prevPressed;
}

/**
 * @param {string} button The name of the button
 * @returns a boolean indicating whether the button is currently pressed
 */
export const buttonIsPressed = (button) => {
  const info = buttonInfo[button];
  return buttonState[info.hand][info.button].pressed;
}

class Wrists {
  static positions = {
    "left": {
      prev: cg.vZero(),
      curr: cg.vZero(),
    },
    "right": {
      prev: cg.vZero(),
      curr: cg.vZero(),
    }
  }

  static flickThreshold = 0.04;

  static updatePos() {
    let posL = Wrists.positions.left;
    let posR = Wrists.positions.right;
    posL.prev = posL.curr.slice();
    posR.prev = posR.curr.slice();
    posL.curr = cg.getPos(getCtrlrMatrix("left"));
    posR.curr = cg.getPos(getCtrlrMatrix("right"));
  }

  static didFlick(hand) {
    let pos = Wrists.positions[hand];
    let sqDist = cg.vSqDistance(pos.curr, pos.prev);
    return sqDist > Wrists.flickThreshold * Wrists.flickThreshold;
  }
}

/**
 * @param {string} handedness 'right' or 'left'
 * @returns {t.matrix4d} controller matrix coresponding to handedness
 */
 export const getCtrlrMatrix = (handedness) => {
  return adjustCtrlrCenter(controllerMatrix[handedness], handedness);
}

/**
 * The center of the controllers isnt exactly in its center
 * so we need to add a slight adjustment to its matrix.
 * @param {t.matrix4d} controllerMatrix 
 * @param {string} handedness 
 * @returns {t.matrix4d} the controller matrix with the adjustment
 */
export const adjustCtrlrCenter = (controllerMatrix, handedness) => {
  const adjustL = [[ .006,0,0], [-.2,1.5,1]];
  const adjustR = [[-.001,0,0], [  1,1.5,1]];

  if (handedness === "left")
      return controllerMatrix.length ? 
            cg.mMultiply(controllerMatrix, cg.mTranslate(...adjustL[0])) :
            cg.mTranslate(adjustL[1]);

  if (handedness === "right")
      return controllerMatrix.length ? 
            cg.mMultiply(controllerMatrix, cg.mTranslate(...adjustR[0])) :
            cg.mTranslate(adjustR[1]);

  throw new Error(`Improper handedness: ${handedness}`);
}
