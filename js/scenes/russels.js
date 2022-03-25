// @ts-check
import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState } from "../render/core/controllerInput.js";
import { lcb, rcb } from "../handle_scenes.js";
import { Cube } from "./gameLib/objects.js";
import c from "./gameLib/colors.js";
import { adjustCtrlrCenter, buttonWentUp, buttonWentDown, getCtrlrMatrix, buttonIsPressed } from "./gameLib/controllers.js";
import { 
   handleObjectMovement, 
   tryGrab, 
   releaseGrab, 
   getTargetedObject, 
   markHovered,
   removeHovered,
   markSelected,
   removeSelected,
   setObjectColors,
   tryAlyxGrab
} from "./gameLib/objectInteractions.js";


export const init = async model => {
   console.log("init russels")

   let target = new Cube(model, [.4, 1.5, -.5]);
   let target2 = new Cube(model, [-.4, 1.5, -.5]);
   target2.defaultColor = c.purple;

   model.animate(() => {

      setObjectColors();
      handleObjectMovement();

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

      if (buttonWentDown("A")) tryAlyxGrab("right");
      if (buttonWentDown("X")) tryAlyxGrab("left");

      // grabbing objects
      if (buttonWentDown("trigger2R")) tryGrab("right");
      if (buttonWentUp("trigger2R")) releaseGrab("right");

      // releasing selected objects
      if (buttonWentUp("triggerR")) removeSelected("right");
      if (buttonWentUp("triggerL")) removeSelected("left");

   });
}
