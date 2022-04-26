import { Zombie } from './enemies.js';
import { Cube, Knife } from './objects.js';
import { getHUD } from './hud.js';

// Create waves object
// key -> wave number
// value -> { objects: [ { entityType, spawnTime, position } ], enemies: [ {...} ]

export class WaveMaker {
  static waveSpawner = null;
  static waveSpawns = {objects: [], enemies: []};
  static model = null;

  static init(waveSpawns, model) {
    WaveMaker.waveSpawns = waveSpawns;
    WaveMaker.model = model;
  }

  static makeWaves() {
    if (canStartNextWave()) {
      let currentWave = getHUD().incrementWave();
      initWave(currentWave);
    }
    waveSpawner.handleSpawns();
  }

  static canStartNextWave() {
    const numOfLiveEnemies = object.keys(enemies).length;
    return numOfLiveEnemies === 0 && (waveSpawner === null || waveSpawner.isEmpty());
  }
  
  static initWave(waveNumber) {
    const spawns = waveSpawns[waveNumber];
    waveSpawner = new WaveSpawner(waveNumber, spawns, model)
  }

}


class WaveSpawner {
  constructor(waveNumber, spawns, model) {
    this.waveNumber = waveNumber;
    this.entitiesLeftToSpawn = this.setSpawnOrder(spawns); // {objects, enemies} // sort arrays in reverse order by time
    this.waveStartTime = model.time;
    this.model = model;
  }

  // sort in reverse order by spawnTime
  static setSpawnOrder(spawns) {
    const keys = Object.keys(spawns);
    keys.forEach(key => {
      const entitySet = spawns[key];
      entitySet.sort((a, b) => (b.spawnTime - a.spawnTime));
    })
  }

  isEmpty() {
    const entitySets = Object.values(this.entitiesLeftToSpawn)
    return entitySets.reduce(ret, entities => (
      ret && entities > 0
    ), true)
  }

  handleSpawns() {
    const currentSpawns = getCurrentSpawns();
    spawnAll(currentSpawns);
  }

  getCurrentSpawns() {
    const keys = Object.keys(this.entitesLeftToSpawn);
    return keys.reduce((spawns, key) => (
      [...spawns, ...this.extractCurrentSpawns(key)]
    ), [])
  }

  extractCurrentSpawns(entitySetKey) {
    const entitySet = this.entitiesLeftToSpawn[entitySetKey];
    while(entitySet.length > 0 && canSpawn(entitySet.at(-1))) 
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
      cube: Cube,
      knife: Knife
    }

    new entityClasses[entityType](this.model, position);
  }

}
