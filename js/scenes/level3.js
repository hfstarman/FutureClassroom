// @ts-check
import { createSpawn } from "./gameLib/utils.js";
import { initGame, runGame } from "./gameLib/main.js";

export const init = async model => {

  // always infinity
  // ring of regular (12?)
  // ring of fast
  // health (maybe not?)
  // ring of armor
  // health
  // space invader style
    // 2 rows of 4 regular
    // 2 rows of 4 fast after a delay
    // 2 rows of 4 armor after a delay

   const spawns = {
      1: {
        objects: [
          createSpawn("ForeverInfiniteThrow", 0, [0,0,0]),
        ],
        enemies: [
          createSpawn("Zombie", 1, [0, 1.5, 4]),
          createSpawn("Zombie", 1.5, [-2, 1.5, 3.5]),
          createSpawn("Zombie", 2, [-3.5, 1.5, 2]),
          createSpawn("Zombie", 2.5, [-4, 1.5, 0]),
          createSpawn("Zombie", 3, [-3.5, 1.5, -2]),
          createSpawn("Zombie", 3.5, [-2, 1.5, -3.5]),
          createSpawn("Zombie", 4, [0, 1.5, -4]),
          createSpawn("Zombie", 4.5, [2, 1.5, -3.5]),
          createSpawn("Zombie", 5, [3.5, 1.5, -2]),
          createSpawn("Zombie", 5.5, [4, 1.5, 0]),
          createSpawn("Zombie", 6, [3.5, 1.5, 2]),
          createSpawn("Zombie", 6.5, [2, 1.5, 3.5]),
        ]
      },
      2: {
        objects: [],
        enemies: [
          createSpawn("FastZombie", 1, [0, 1.5, 4]),
          createSpawn("FastZombie", 1.5, [-2, 1.5, 3.5]),
          createSpawn("FastZombie", 2, [-3.5, 1.5, 2]),
          createSpawn("FastZombie", 2.5, [-4, 1.5, 0]),
          createSpawn("FastZombie", 3, [-3.5, 1.5, -2]),
          createSpawn("FastZombie", 3.5, [-2, 1.5, -3.5]),
          createSpawn("FastZombie", 4, [0, 1.5, -4]),
          createSpawn("FastZombie", 4.5, [2, 1.5, -3.5]),
          createSpawn("FastZombie", 5, [3.5, 1.5, -2]),
          createSpawn("FastZombie", 5.5, [4, 1.5, 0]),
          createSpawn("FastZombie", 6, [3.5, 1.5, 2]),
          createSpawn("FastZombie", 6.5, [2, 1.5, 3.5]),
        ],
      },
      3: {
        objects: [],
        enemies: [
          createSpawn("ArmoredZombie", 1, [0, 1.5, 4]),
          createSpawn("ArmoredZombie", 1.5, [-2, 1.5, 3.5]),
          createSpawn("ArmoredZombie", 2, [-3.5, 1.5, 2]),
          createSpawn("ArmoredZombie", 2.5, [-4, 1.5, 0]),
          createSpawn("ArmoredZombie", 3, [-3.5, 1.5, -2]),
          createSpawn("ArmoredZombie", 3.5, [-2, 1.5, -3.5]),
          createSpawn("ArmoredZombie", 4, [0, 1.5, -4]),
          createSpawn("ArmoredZombie", 4.5, [2, 1.5, -3.5]),
          createSpawn("ArmoredZombie", 5, [3.5, 1.5, -2]),
          createSpawn("ArmoredZombie", 5.5, [4, 1.5, 0]),
          createSpawn("ArmoredZombie", 6, [3.5, 1.5, 2]),
          createSpawn("ArmoredZombie", 6.5, [2, 1.5, 3.5]),
        ],
      },
      4: {
        objects: [
          createSpawn("HealthPickup", 0, [0, 1.5, 0]),
        ],
        enemies: [],
      },
      5: {
        objects: [],
        enemies: [
          createSpawn("FastZombie", 1, [-1.5, 1.5, 4.0]),
          createSpawn("FastZombie", 1, [1.5, 1.5, 4.0]),
          createSpawn("FastZombie", 1, [-3.0, 1.5, 4.0]),
          createSpawn("FastZombie", 1, [3.0, 1.5, 4.0]),
          createSpawn("FastZombie", 4, [-1.5, 1.5, 4.0]),
          createSpawn("FastZombie", 4, [1.5, 1.5, 4.0]),
          createSpawn("FastZombie", 4, [-3.0, 1.5, 4.0]),
          createSpawn("FastZombie", 4, [3.0, 1.5, 4.0]),
          createSpawn("Zombie", 7, [-1.5, 1.5, 4.0]),
          createSpawn("Zombie", 7, [1.5, 1.5, 4.0]),
          createSpawn("Zombie", 7, [-3.0, 1.5, 4.0]),
          createSpawn("Zombie", 7, [3.0, 1.5, 4.0]),
          createSpawn("Zombie", 12, [-1.5, 1.5, 4.0]),
          createSpawn("Zombie", 12, [1.5, 1.5, 4.0]),
          createSpawn("Zombie", 12, [-3.0, 1.5, 4.0]),
          createSpawn("Zombie", 12, [3.0, 1.5, 4.0]),
          createSpawn("ArmoredZombie", 17, [-1.5, 1.5, 4.0]),
          createSpawn("ArmoredZombie", 17, [1.5, 1.5, 4.0]),
          createSpawn("ArmoredZombie", 17, [-3.0, 1.5, 4.0]),
          createSpawn("ArmoredZombie", 17, [3.0, 1.5, 4.0]),
          createSpawn("ArmoredZombie", 23, [-1.5, 1.5, 4.0]),
          createSpawn("ArmoredZombie", 23, [1.5, 1.5, 4.0]),
          createSpawn("ArmoredZombie", 23, [-3.0, 1.5, 4.0]),
          createSpawn("ArmoredZombie", 23, [3.0, 1.5, 4.0]),
        ],
      },
   }

   initGame(model, spawns);
   model.animate(runGame);
}
