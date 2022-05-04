// @ts-check
import { createSpawn } from "./gameLib/utils.js";
import { initGame, runGame } from "./gameLib/main.js";

export const init = async model => {

   const spawns = {
      1: {
         objects: [
            createSpawn("HealthPickup", 1, [-.6, 1, -.5]),
            createSpawn("InfiniteThrow", 1, [.6, 1, -.5]),
            createSpawn("Knife", 0, [0, 1.5, -.5]),
         ],
         enemies: [
            createSpawn("Zombie", 1.5, [1, 1.5, 2.5]),
            createSpawn("FastZombie", 2, [0, 1.5, 2.5]),
            createSpawn("ArmoredZombie", 2.5, [-1, 1.5, 2.5]),
         ]
      },
   }

   initGame(model, spawns, true);
   model.animate(runGame);
}
