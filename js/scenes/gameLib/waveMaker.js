// @ts-check
import { Zombie, FastZombie, ArmoredZombie } from './enemies.js';
import { Cube, Knife, InfinitePower, HealthPickup } from './objects.js';
import { getHUD } from './hud.js';
import { enemies } from './enemies.js';

// Create waves object
// key -> wave number
// value -> { objects: [ { entityType, spawnTime, position } ], enemies: [ {...} ]

export class WaveMaker {
  static waveSpawner = null;
  static waveSpawns = {};
  static model = null;
  static root = null;
  static numberOfWaves = 0;

  static init(model, root, waveSpawns) {
    WaveMaker.waveSpawns = waveSpawns;
    WaveMaker.model = model;
    WaveMaker.root = root;
    WaveMaker.numberOfWaves = Object.keys(waveSpawns).length;
  }

  static makeWaves() {
    if (WaveMaker.canStartNextWave()) {
      if (getHUD().wave >= WaveMaker.numberOfWaves) return;
      let currentWave = getHUD().incrementWave();
      WaveMaker.initWave(currentWave);
    }
    WaveMaker.waveSpawner.handleSpawns();
  }

  static canStartNextWave() {
    const numOfLiveEnemies = Object.keys(enemies).length;
    return numOfLiveEnemies === 0 && 
          (WaveMaker.waveSpawner === null || WaveMaker.waveSpawner.isEmpty());
  }
  
  static initWave(waveNumber) {
    const spawns = WaveMaker.waveSpawns["" + waveNumber];
    WaveMaker.waveSpawner = new WaveSpawner(waveNumber, spawns, WaveMaker.model, WaveMaker.root)
  }

  static wonGame() {
    return getHUD().wave >= WaveMaker.numberOfWaves && WaveMaker.canStartNextWave();
  }

}


class WaveSpawner {
  constructor(waveNumber, spawns, model, root) {
    this.waveNumber = waveNumber;
    this.entitiesLeftToSpawn = WaveSpawner.setSpawnOrder(spawns); // {objects, enemies} // sort arrays in reverse order by time
    this.waveStartTime = model.time;
    this.model = model;
    this.root = root;
  }

  // sort in reverse order by spawnTime
  static setSpawnOrder(spawns) {
    const keys = Object.keys(spawns);
    keys.forEach(key => {
      const entitySet = spawns[key];
      entitySet.sort((a, b) => (b.spawnTime - a.spawnTime));
    })
    return spawns;
  }

  isEmpty() {
    const entitySets = Object.values(this.entitiesLeftToSpawn)
    return entitySets.reduce((ret, entities) => (
      ret && entities.length === 0
    ), true)
  }

  handleSpawns() {
    const currentSpawns = this.getCurrentSpawns();
    this.spawnAll(currentSpawns);
  }

  getCurrentSpawns() {
    const keys = Object.keys(this.entitiesLeftToSpawn);
    return keys.reduce((spawns, key) => {
      const extracted = this.extractCurrentSpawns(key);
      return [...spawns, ...extracted];
    }, []);
  }

  extractCurrentSpawns(entitySetKey) {
    const spawns = [];
    const entitySet = this.entitiesLeftToSpawn[entitySetKey];
    while(entitySet.length > 0 && this.canSpawn(entitySet.at(-1))) 
      spawns.push(entitySet.pop());
    return spawns;
  }

  canSpawn(spawnInfo) {
    const { spawnTime } = spawnInfo
    if(this.timeSinceWaveStart() >= spawnTime)
      return true;
    else
      return false;
  }

  timeSinceWaveStart() {
    return this.model.time - this.waveStartTime;
  }

  spawnAll(spawns) {
    spawns.forEach(spawnInfo => {
      const { entityType, position } = spawnInfo;
      this.spawn(entityType, position);
    });
  }

  spawn(entityType, position) {
    const entityClasses = {
      zombie: Zombie,
      fastzombie: FastZombie,
      armoredzombie: ArmoredZombie,
      cube: Cube,
      knife: Knife,
      infinitethrow: InfinitePower,
      healthpickup: HealthPickup,
    }

    if (entityType === "ForeverInfiniteThrow") {
      const infPower = new InfinitePower(this.model, this.root, [0, 15, 0]);
      infPower.duration = 1000000;
      infPower.activate();
    } else {      
      const entityTypeCleaned = entityType.replace(/\s/g, '').toLowerCase();
      new entityClasses[entityTypeCleaned](this.model, this.root, position);
    }
  }

}
