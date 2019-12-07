export default function(orbits) {
  const tree = {};

  orbits.forEach(orbit => {
    const [parent, child] = orbit.split(")");

    tree[parent] = tree[parent] || { name: parent };
    tree[child] = tree[child] || { name: child };

    tree[parent].child = tree[child];
    tree[child].parent = tree[parent];
  });

  return tree;
}

