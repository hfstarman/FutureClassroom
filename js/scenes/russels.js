import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState } from "../render/core/controllerInput.js";
import { solveBallisticArc } from "../util/math.js";
import { lcb, rcb } from "../handle_scenes.js";

   class ControllerEvents {
      constructor() {
         this.triggerDown = false;
         this.triggerUp   = false;
         this.btn1Down    = false;
         this.btn1Up      = false;
      }
   }

   const getHeight = (matrix) => matrix[13];

   const isEmptyOrNull = (arr) => arr === null || arr === undefined || arr === [];

   let isSelectedLeft, isSelectedRight;
   let previousMatrix;
   let grabbed = false;
   let moveDir = [0,0,0];
   const grabDistance = .3;
   let dv = cg.mIdentity();
   let gravity = 0.002;
   let mGravity = cg.mIdentity();
   mGravity[13] = -gravity;
   let restutition = .1;
   let friction = .2;

   let buttonDown = false;

   export const init = async model => {
      isSelectedLeft = isSelectedRight = false;

      // CREATE THE TARGET

      let target = model.add();
      target.add('cube').texture('media/textures/brick.png');
      target.move(0, 1.5, 0).scale(.1, .1, .1).turnZ(Math.PI/2);
      previousMatrix = target.getMatrix();

      console.log("init russels")
      // CREATE THE LASER BEAMS FOR THE LEFT AND RIGHT CONTROLLERS

      // let beamL = model.add();
      // beamL.add('cube').color(0,0,1).move(.02,0,0).scale(.02,.005,.005);
      // beamL.add('cube').color(0,1,0).move(0,.02,0).scale(.005,.02,.005);
      // beamL.add('cube').color(1,0,0).move(0,0,.02).scale(.005,.005,.02);
      // beamL.add('tubeZ').color(1,0,0).move(0,0,-10).scale(.001,.001,10); // RED

      // let beamR = model.add();
      // beamR.add('cube').color(0,0,1).move(.02,0,0).scale(.02,.005,.005);
      // beamR.add('cube').color(0,1,0).move(0,.02,0).scale(.005,.02,.005);
      // beamR.add('cube').color(1,0,0).move(0,0,.02).scale(.005,.005,.02);
      // beamR.add('tubeZ').color(0,1,0).move(0,0,-10).scale(.001,.001,10); // GREEN

      let grabbedObject = null;

      model.animate(() => {
         console.log("animate russels")
         // use model.deltaTime for time-based animation
         // GET THE CURRENT MATRIX AND TRIGGER INFO FOR BOTH CONTROLLERS

         let matrixL  = controllerMatrix.left;
         let triggerL = buttonState.left[0].pressed;

         let matrixR  = controllerMatrix.right;
         let triggerR = buttonState.right[0].pressed;
         let trigger2R  = buttonState.right[1].pressed;
         // trigger2 = 1
         // A = 4
         // B = 5
         let btnA = buttonState.right[4].pressed;
         let btnB = buttonState.right[5].pressed;

         // place beams on controllers
         // if not in VR mode then place beams in default positions
         let LM = matrixL.length ? cg.mMultiply(matrixL, cg.mTranslate( .006,0,0)) : cg.mTranslate(-.2,1.5,1);
         let RM = matrixR.length ? cg.mMultiply(matrixR, cg.mTranslate(-.001,0,0)) : cg.mTranslate(1,1.5,1);
         // model.child(1).setMatrix(LM);
         // model.child(2).setMatrix(RM);

         // ANIMATE THE TARGET
         let target = model.child(0);

         let prevPrevMatrix = previousMatrix;

         if (grabbed) {
            // move it to the front of the controller
            // then turn it 45 degrees
            target.setMatrix(RM).move(0, -.14, -.15).turnX(Math.PI/4).scale(.1, .1, .1);
         } else {
            target.setMatrix(previousMatrix);

            if (getHeight(target.getMatrix()) + (.3/2) + dv[13] <= 1) {
               // add bounce
               dv[13] = -dv[13] * restutition; // Y
               
               dv[12] = dv[12] * (1-friction); // X
               dv[14] = dv[14] * (1-friction); // Z
            } else {
               // add gravity
               dv = cg.mm(dv, mGravity);
            }

            target.setMatrix(cg.mm(target.getMatrix(), dv));

         }  
         // remember the position after moving it
         previousMatrix = target.getMatrix();

         // now get the difference between the two coordinates
         // use that for the dx dy dz
         if (grabbed) {
            // (this code is used for throwing)
            // when you get go then the object maintains the same velocity the controller had
            dv[12] = previousMatrix[12] - prevPrevMatrix[12];
            dv[13] = previousMatrix[13] - prevPrevMatrix[13];
            dv[14] = previousMatrix[14] - prevPrevMatrix[14];
         }


         // if (model.time % 10 == 0) {
         //    console.log(target.getMatrix());
         // }

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

         if (isSelectedLeft) target.color(1,0,0);
         else if (isSelectedRight) target.color(1,0,0);
         else target.color(1,1,1);

         if (btnA && !buttonDown) {
            buttonDown = true;
            // pick some angle
            let angle = Math.PI * (1/3); // 60 degrees
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
               sol = solveBallisticArc(targetPos, speed, controllerPos, gravity);
               speed += .02;
            }
            console.log("solution:")
            console.log(sol)
            if (sol.length > 0) dv = cg.mm(dv, cg.mTranslate(sol[1]));
            // dv = cg.mm(dv, cg.mTranslate(vector));
         }

         if (!btnA && buttonDown) {
            buttonDown = false;
         }

         if (trigger2R && cg.sqCenterDist(RM, target.getMatrix()) < grabDistance * grabDistance) {
            grabbed = true;
         }

         if (!trigger2R) {
            grabbed = false;
         }

         if (btnB) grabbed = true;
      });
   }

/*
   Object Model
   ------------
   gravity modifier
   restitution
   bounding box
   loc_state = {held, stored, free}
   storedSlot
   x,y,z init scaling
   current speed (current location - previous location)
*/