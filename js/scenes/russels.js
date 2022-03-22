// @ts-check
import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState } from "../render/core/controllerInput.js";
import { solveBallisticArc } from "../util/math.js";
import { lcb, rcb } from "../handle_scenes.js";
import { Cube } from "./gameLib/objects.js";
import { adjustCtrlrCenter, buttonWentUp, buttonWentDown } from "./gameLib/controllers.js";
import { handleObjectMovement, tryGrab, releaseGrab } from "./gameLib/objectInteractions.js";

   const isEmptyOrNull = (arr) => arr === null || arr === undefined || arr === [];

   let isSelectedLeft, isSelectedRight;

   let buttonDown1 = false;

   export const init = async model => {
      isSelectedLeft = isSelectedRight = false;

      // CREATE THE TARGET

      console.log("init russels")

      let target = new Cube(model, [.4, 1.5, -.5]);
      let target2 = new Cube(model, [-.4, 1.5, -.5]);
      target2.entity.color([1, 0, 1]);

      model.animate(() => {
         // use model.deltaTime for time-based animation
         // GET THE CURRENT MATRIX AND TRIGGER INFO FOR BOTH CONTROLLERS
         let LM  = adjustCtrlrCenter(controllerMatrix.left, "left");
         let triggerL = buttonState.left[0].pressed;

         let RM  = adjustCtrlrCenter(controllerMatrix.right, "right");
         let triggerR = buttonState.right[0].pressed;
         let trigger2R  = buttonState.right[1].pressed;
         // trigger2 = 1
         // A = 4
         // B = 5
         let btnA = buttonState.right[4].pressed;
         let btnB = buttonState.right[5].pressed;

         // console.log(trigger2R)

         handleObjectMovement();

	 // CHECK TO SEE WHETHER EACH BEAM INTERSECTS WITH THE TARGET

         // let hitL = cg.mHitRect(LM, target.getMatrix());
         // let hitR = cg.mHitRect(RM, target.getMatrix());
         let hitL = lcb.hitRect(target.getMatrix());
         let hitR = rcb.hitRect(target.getMatrix());

         // set selected
         // only one controller can select the target at a time
         if  (hitL && triggerL && !isSelectedRight) isSelectedLeft = true;
         else if (hitR && triggerR && !isSelectedLeft) isSelectedRight = true;

         // set deselected
         if (!triggerL) isSelectedLeft = false;
         if (!triggerR) isSelectedRight = false;

         if (isSelectedLeft) target.entity.color(1,0,0);
         else if (isSelectedRight) target.entity.color(1,0,0);
         else target.entity.color(1,1,1);

         if (btnA && !buttonDown1) {
            buttonDown1 = true;
            // pick some angle
            // let angle = Math.PI * (1/3); // 60 degrees
            // and some speed
            // then convert to xyz vector
            // set dv
            
            const targetPos = cg.getPos(target.getMatrix());
            const controllerPos = cg.getPos(RM);
            // let vector = cg.normalize(cg.vsub(controllerPos, targetPos));
            // vector = cg.scale(vector, .1);
            let sol = null;
            let speed = .1;
            while (isEmptyOrNull(sol) && speed < .3) {
               sol = solveBallisticArc(targetPos, speed, controllerPos, target.gravity);
               speed += .02;
            }
            console.log("solution:")
            console.log(sol)
            if (sol.length > 0) target.setVelocity(sol[1]);
            // if (sol.length > 0) dv = cg.mm(dv, cg.mTranslate(sol[1]));
            // dv = cg.mm(dv, cg.mTranslate(vector));
         }

         if (!btnA && buttonDown1) {
            buttonDown1 = false;
         }

         // iterate over all objects and check which ones are close enough to get grabbed
         // select the closest one
         // if (trigger2R && cg.sqCenterDist(RM, target.getMatrix()) < grabDistance * grabDistance) {
         //    grabbed = true;
         // }

         if (buttonWentDown("triggerR")) {
            tryGrab("right");
         }

         if (buttonWentUp("triggerR")) {
            releaseGrab("right");
            // grabbed = false;
         }

         // console.log(buttonWentUp("trigger2R"));
         // if (btnB) grabbed = true;
      });
   }
