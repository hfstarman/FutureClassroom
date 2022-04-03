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
  let hitL = getTargetedObject("left");
  let hitR = getTargetedObject("right");


  if (hitR !== null) {
    console.log(hitR.getName());
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

  if (buttonWentDown("A")) tryAlyxGrab("right");
  if (buttonWentDown("X")) tryAlyxGrab("left");

  // grabbing objects
  if (buttonWentDown("trigger2R")) tryGrab("right");
  if (buttonWentUp("trigger2R")) releaseGrab("right");

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

    "triggerL" : { hand: "left",  button: 0, pressed: false },
    "trigger2L": { hand: "left",  button: 1, pressed: false },
    "joyBtnL"  : { hand: "left",  button: 3, pressed: false },
    "X"        : { hand: "left",  button: 4, pressed: false },
    "Y"        : { hand: "left",  button: 5, pressed: false },
  
    "triggerR" : { hand: "right", button: 0, pressed: false },
    "trigger2R": { hand: "right", button: 1, pressed: false },
    "btnJoyR"  : { hand: "right", button: 3, pressed: false },
    "A":         { hand: "right", button: 4, pressed: false },
    "B":         { hand: "right", button: 5, pressed: false },
  
  }

})();

// let prevButtonState = JSON.parse(JSON.stringify(buttonState));

/**
 * @param {string} button The name of the button
 * @returns a boolean indicating whether the button was released this frame
 */
export const buttonWentDown = (button) => {
  const info = buttonInfo[button];

  const prevPressed = info.pressed;
  const currPressed = buttonState[info.hand][info.button].pressed;
  let result = !prevPressed && currPressed;
  // if (button == "triggerR")
    // console.log(`BUTTON STATE: ${currPressed}, PREV: ${prevPressed}, result: ${result}`);

  if (result) info.pressed = currPressed;

  return result;
}

/**
 * @param {string} button The name of the button
 * @returns a boolean indicating whether the button was pressed this frame
 */
export const buttonWentUp = (button) => {
  const info = buttonInfo[button];

  const prevPressed = info.pressed;
  const currPressed = buttonState[info.hand][info.button].pressed;
  let result = prevPressed && !currPressed;
  // console.log(`BUTTON STATE: ${currPressed}, PREV: ${prevPressed}, result: ${result}`);

  if (result) info.pressed = currPressed;

  return result;
}

/**
 * @param {string} button The name of the button
 * @returns a boolean indicating whether the button is currently pressed
 */
export const buttonIsPressed = (button) => {
  const info = buttonInfo[button];
  return buttonState[info.hand][info.button].pressed;
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