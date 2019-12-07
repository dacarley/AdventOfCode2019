import orbits from "./orbits.js";

import buildTree from "./buildTree.js";

const tree = buildTree(orbits);

function getPath(name) {
  const path = [];
  let node = tree[name];

  while (node) {
    path.push(node.name);
    node = node.parent;
  }
  
  return path;
}

const youPath = getPath("YOU");
const sanPath = getPath("SAN");

let iYou = youPath.length - 1;
let iSan = sanPath.length - 1;
while (youPath[iYou--] === sanPath[iSan--]) {
  // nop
}

console.log(iYou + iSan + 2);
