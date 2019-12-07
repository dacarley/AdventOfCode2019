import orbits from "./orbits.js";
import buildTree from "./buildTree.js";

const tree = buildTree(orbits);

function countOrbits(item) {
  return item.parent
    ? 1 + countOrbits(item.parent)
    : 0;
}

let numOrbits = 0;
Object.values(tree).forEach(item => {
  numOrbits += countOrbits(item);
});

console.log(numOrbits);

