// @ts-check
import { Cube, Knife } from "./gameLib/objects.js";
import { Zombie } from "./gameLib/enemies.js";
import c from "./gameLib/colors.js";
import { initGame, runGame } from "./gameLib/main.js";

export const init = async model => {
   console.log("init russels")
   initGame(model);

   new Cube(model, [.4, 1.5, -.5]);
   let target2 = new Cube(model, [-.4, 1.5, -.5]);
   target2.defaultColor = c.purple;

   let knife = new Knife(model, [0, 1.5, -.5]);

   let zombie = new Zombie(model, [-1, 1.5, -1], 0);
   zombie.entity.turnY(Math.PI);

   model.animate(() => {
      // knife.entity.turnY(Math.sin(model.time) * .1);
      // zombie.leftLeg.turnX(1 * model.deltaTime);
      runGame();
   });
}
