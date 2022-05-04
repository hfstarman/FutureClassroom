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
        objects: [
          createSpawn("Knife", 0, [-.6, 1.5, -.5]),
          createSpawn("Knife", 0, [.6, 1.5, -.5]),
          createSpawn("Knife", 7, [-.6, 1.5, -.5]),
          createSpawn("Knife", 7, [.6, 1.5, -.5]),
          createSpawn("InfiniteThrow", 12, [0, 2, 4]),
        ],
        enemies: [
          createSpawn("ArmoredZombie", 1, [-1.25, 1.5, 3.5]),
          createSpawn("ArmoredZombie", 1, [1.25, 1.5, 3.5]),
          createSpawn("Zombie", 5, [0, 1.5, 4]),
          createSpawn("Zombie", 8, [1.5, 1.5, 3]),
          createSpawn("Zombie", 8, [-1.5, 1.5, 3]),
          createSpawn("Zombie", 11, [3, 1.5, 2]),
          createSpawn("Zombie", 11, [-3, 1.5, 2]),
          createSpawn("Zombie", 14, [4.5, 1.5, 1]),
          createSpawn("Zombie", 14, [-4.5, 1.5, 1]),
        ],
      },
      4: {
        objects: [
          createSpawn("HealthPickup", 0, [0, 1.5, 0]),
          createSpawn("Knife", 5, [.6, 1.5, -.5]),
          createSpawn("Knife", 5, [0, 1.5, -.5]),
          createSpawn("Knife", 5, [-.6, 1.5, -.5]),
        ],
        enemies: [],
      },
      5: {
        objects: [
          createSpawn("InfiniteThrow", 20, [0, 1.5, 0]),
        ],
        enemies: [
          createSpawn("FastZombie", 1, [1.5, 1.5, 4]),
          createSpawn("FastZombie", 1, [-1.5, 1.5, 4]),
          createSpawn("FastZombie", 1, [3, 1.5, 4]),
          createSpawn("FastZombie", 1, [-3, 1.5, 4]),
          createSpawn("Zombie", 5, [1.5, 1.5, 4]),
          createSpawn("Zombie", 5, [-1.5, 1.5, 4]),
          createSpawn("Zombie", 5, [3, 1.5, 4]),
          createSpawn("Zombie", 5, [-3, 1.5, 4]),
          createSpawn("ArmoredZombie", 10, [1.5, 1.5, 4]),
          createSpawn("ArmoredZombie", 10, [-1.5, 1.5, 4]),
          createSpawn("ArmoredZombie", 10, [3, 1.5, 4]),
          createSpawn("ArmoredZombie", 10, [-3, 1.5, 4]),
        ],
      },
   }

   initGame(model, spawns);
   model.animate(runGame);
}
