// @ts-check
import { createSpawn } from "./gameLib/utils.js";
import { initGame, runGame } from "./gameLib/main.js";

export const init = async model => {

   // ony regular and fast zombie spawns (and health pickups)
   // 1 zom + 1 knife
   // 3 zom + extra knife?
   // several zom -> 7 in a z line and 2 on the side . z . + maybe extra knife?
   // 1 health pickup
   // 3 fast zom
   // (15) mix of regular and fast zom (mostly regular + slow spawn)
     // random spawns in front of you, maybe a little on the side
     // 2 extra knives in front of you
   // (20) (faster spawn) another mix of regular and fast (health in the middle)
     // spawning left to right (starting in front of player, ending behind)
     // knife spawn after every 5 zombies

   const randLocation = () => {
      const locs = [
         [-1.5, 1.5, 4],
         [1.5, 1.5, 4],
         [0, 1.5, 4],
         [-3, 1.5, 4],
         [3, 1.5, 4],
         [4.5, 1.5, 4],
         [4.5, 1.5, 4],
      ]
      return locs[Math.floor(Math.random() * locs.length)];
   }

   const spawns = {
      1: {
         objects: [
            createSpawn("Knife", 0, [0, 1.5, -.5]),
         ],
         enemies: [
            createSpawn("Zombie", 2, [0, 1.5, 4]),
         ]
      },
      2 : {
         objects: [
            createSpawn("Knife", 0, [0, 1.5, -.5]),
         ],
         enemies: [
            createSpawn("Zombie", 2.5, [1, 1.5, 3.5]),
            createSpawn("Zombie", 2, [0, 1.5, 3.5]),
            createSpawn("Zombie", 2.5, [-1, 1.5, 3.5]),
         ],
      },
      3 : {
         objects: [
            createSpawn("Knife", 4, [-.6, 1.5, -.5]),
            createSpawn("Knife", 6, [.6, 1.5, -.5]),
         ],
         enemies: [
            createSpawn("Zombie", 2, [-1.5, 1.5, 3.5]),
            createSpawn("Zombie", 5, [0, 1.5, 3.5]),
            createSpawn("Zombie", 8, [1.5, 1.5, 3.5]),
            createSpawn("Zombie", 11, [0, 1.5, 3.5]),
            createSpawn("Zombie", 11, [-3, 1.5, 3.5]),
            createSpawn("Zombie", 11, [3, 1.5, 3.5]),
            createSpawn("Zombie", 14, [-1.5, 1.5, 3.5]),
            createSpawn("Zombie", 17, [0, 1.5, 3.5]),
            createSpawn("Zombie", 20, [1.5, 1.5, 3.5]),
         ],
      },
      4 : {
         objects: [
            createSpawn("HealthPickup", 1, [0, 1.5, -.5]),
         ],
         enemies: [],
      },
      5 : {
         objects: [
            createSpawn("Knife", 0, [-.6, 1.5, -.5]),
         ],
         enemies: [
            createSpawn("FastZombie", 2.5, [1, 1.5, 2.5]),
            createSpawn("FastZombie", 2, [0, 1.5, 2.5]),
            createSpawn("FastZombie", 2.5, [-1, 1.5, 2.5]),
         ],
      },
      6 : {
         objects: [
            createSpawn("Knife", 0, [-.6, 1.5, -.5]),
            createSpawn("Knife", 0, [0, 1.5, -.5]),
            createSpawn("Knife", 0, [.6, 1.5, -.5]),
            // createSpawn("HealthPickup", 15, [4, 3, 4]),
         ],
         enemies: [
            createSpawn("Zombie", 2, randLocation()),
            createSpawn("Zombie", 4, randLocation()),
            createSpawn("Zombie", 6, randLocation()),
            createSpawn("FastZombie", 8, randLocation()),
            createSpawn("FastZombie", 10, randLocation()),
            createSpawn("FastZombie", 12, randLocation()),
            createSpawn("Zombie", 14, randLocation()),
            createSpawn("Zombie", 16, randLocation()),
            createSpawn("Zombie", 18, randLocation()),
            createSpawn("Zombie", 20, randLocation()),
            createSpawn("Zombie", 22, randLocation()),
            createSpawn("Zombie", 24, randLocation()),
            createSpawn("FastZombie", 26, randLocation()),
            createSpawn("FastZombie", 28, randLocation()),
            createSpawn("FastZombie", 30, randLocation()),
         ],
      },
      7 : {
         objects: [
            createSpawn("Knife", 0, [-.6, 1.5, -.5]),
            createSpawn("Knife", 0, [0, 1.5, -.5]),
            createSpawn("Knife", 0, [.6, 1.5, -.5]),
            createSpawn("InfiniteThrow", 5, [-4, 3, 4]),
            createSpawn("Knife", 20, [-.6, 1.5, -.5]),
            createSpawn("Knife", 20, [0, 1.5, -.5]),
            createSpawn("Knife", 20, [.6, 1.5, -.5]),
         ],
         enemies: [
            createSpawn("Zombie", 1, randLocation()),
            createSpawn("Zombie", 2, randLocation()),
            createSpawn("Zombie", 3, randLocation()),
            createSpawn("Zombie", 4, randLocation()),
            createSpawn("FastZombie", 5, randLocation()),
            createSpawn("FastZombie", 6, randLocation()),
            createSpawn("FastZombie", 7, randLocation()),
            createSpawn("FastZombie", 8, randLocation()),
            createSpawn("FastZombie", 9, randLocation()),
            createSpawn("FastZombie", 10, randLocation()),
            createSpawn("Zombie", 13, randLocation()),
            createSpawn("Zombie", 16, randLocation()),
            createSpawn("Zombie", 19, randLocation()),
            createSpawn("Zombie", 22, randLocation()),
            createSpawn("Zombie", 25, randLocation()),
            createSpawn("Zombie", 28, randLocation()),
            createSpawn("Zombie", 31, randLocation()),
            createSpawn("FastZombie", 34, randLocation()),
            createSpawn("FastZombie", 37, randLocation()),
            createSpawn("FastZombie", 40, randLocation()),
         ],
      },
   }

   initGame(model, spawns);
   model.animate(runGame);
}
