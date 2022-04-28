// @ts-check
import * as cg from "../../render/core/cg.js";

export const isEmptyOrNull = (arr) => arr === null || arr === undefined || arr === [];

export const getLowestY = (entity) => {
  let rootMatrix = entity.getMatrix();
  const children = entity._children;
  let lowestY = Infinity;
  for (let i = 0; i < children.length; i++) {
    let childY = getLowestY_aux(children[i], rootMatrix);
    lowestY = Math.min(lowestY, childY);
  }
  return lowestY;
}

const getLowestY_aux = (entity, parentWorldMatrix) => {
  let myMatrix = entity.getMatrix();
  let myWorldMatrix = cg.mm(myMatrix, parentWorldMatrix);
  let lowestY = myWorldMatrix[13] - myWorldMatrix[5]; // m[13] -> y coordinate, m[5] -> y scale
  const children = entity._children;
  for (let i = 0; i < children.length; i++) {
    let childY = getLowestY_aux(children[i], myWorldMatrix);
    lowestY = Math.min(lowestY, childY);
  }
  return lowestY;
}

export const createSpawn = (entityType, spawnTime, position) => (
  {entityType, spawnTime, position}
);