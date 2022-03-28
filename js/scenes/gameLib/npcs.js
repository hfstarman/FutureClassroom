
let enemyId = 0;
export const enemies = {};
export const removeEnemy = (enemy) => {
  delete enemies[enemy.id];
}

export class Enemy {
  constructor(model, initPosition, spawnTime) {
    this.model = model;
    this.entity = model.add();
    this.entity.move(initPosition);
    this.spawnTime = spawnTime;


    this.id = enemyId++;
    enemies[this.id] = this;
  }
}