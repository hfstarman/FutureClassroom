// @ts-check
import { Cube, Knife } from "./gameLib/objects.js";
import c from "./gameLib/colors.js";
import runGame from "./gameLib/main.js";

export const init = async model => {
   console.log("init russels")

   new Cube(model, [.4, 1.5, -.5]);
   let target2 = new Cube(model, [-.4, 1.5, -.5]);
   target2.defaultColor = c.purple;

   let knife = new Knife(model, [0, 1.5, -.5]);

   model.animate(() => {
      // knife.entity.turnY(Math.sin(model.time) * .1);
      runGame();
   });
}
