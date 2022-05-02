// @ts-check
import { Cube, Knife, HealthPickup, InfinitePower } from "./gameLib/objects.js";
import { Zombie } from "./gameLib/enemies.js";
import c from "./gameLib/colors.js";
import { createSpawn } from "./gameLib/utils.js";
import { initGame, runGame } from "./gameLib/main.js";

export const init = async model => {

   // const health = new HealthPickup(model, [0, 1.5, 0]);
   // const inf = new InfinitePower(model, [-0.4, 1.5, 0]);

   const spawns = {
      1: {
         objects: [
            createSpawn("HealthPickup", 0, [-.4, 1.5, -.5]),
            createSpawn("InfiniteThrow", 1, [.4, 1.5, -.5]),
            createSpawn("Knife", 2, [0, 1.5, -.5]),
         ],
         enemies: [
            createSpawn("Zombie", 4, [-1, 1.5, -1]),
         ]
      },
      2: {
         objects: [],
         enemies: [
            createSpawn("FastZombie", 4, [.5, 1.5, -4]),
            createSpawn("ArmoredZombie", 4, [-.5, 1.5, -4]),
         ]
      }
   }

   initGame(model, spawns);
   model.animate(() => {
      runGame();
   });
}
