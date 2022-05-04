// @ts-check
import { createSpawn } from "./gameLib/utils.js";
import { initGame, runGame } from "./gameLib/main.js";

export const init = async model => {

  // introduce armored zombies and infinity throw
  // 1 armor + 2 knives
  // 3 armor + 2 infinity throws
  // 2 armor + 2 knives + several  regular making an upside down V (it'll look like an A)
  // space invaders style of 12 zombies (4 fast, 4 reg, 4 armor)
    // 1 infinity throw + 3 knives
  // 1 health pack

   const spawns = {
      1: {
        objects: [
          createSpawn("Knife", 0, [-.6, 1.5, -.5]),
          createSpawn("Knife", 0, [.6, 1.5, -.5]),
        ],
        enemies: [
          createSpawn("ArmoredZombie", 1.5, [0, 1.5, 3.5]),
        ]
      },
      2: {
        objects: [
          createSpawn("InfiniteThrow", 4, [0, 1.5, -.5]),
        ],
        enemies: [
          createSpawn("ArmoredZombie", 1, [-1.5, 1.5, 3.5]),
          createSpawn("ArmoredZombie", 2, [0, 1.5, 3.5]),
          createSpawn("ArmoredZombie", 3, [1.5, 1.5, 3.5]),
        ],
      },
      3: {
        objects: [],
        enemies: [],
      },
      4: {
        objects: [],
        enemies: [],
      },
      5: {
        objects: [],
        enemies: [],
      },
   }

   initGame(model, spawns);
   model.animate(runGame);
}
