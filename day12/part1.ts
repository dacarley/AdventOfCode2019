import * as fs from "fs";

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const pattern = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
const moons = input.split("\n").map(line => {
    const [, x, y, z] = line.match(pattern);

    return {
        x: Number.parseInt(x),
        vx: 0,
        y: Number.parseInt(y),
        vy: 0,
        z: Number.parseInt(z),
        vz: 0
    };
});

for (let n = 0; n < 1000; ++n) {
    for (let i = 0; i < moons.length; ++i) {
        const moon = moons[i];

        for (let j = 0; j < moons.length; ++j) {
            let dx = moon.x - moons[j].x;
            if (dx !== 0) {
                dx = -(dx / Math.abs(dx));
                moon.vx += dx;
            }

            let dy = moon.y - moons[j].y;
            if (dy !== 0) {
                dy = -(dy / Math.abs(dy));
                moon.vy += dy;
            }

            let dz = moon.z - moons[j].z;
            if (dz !== 0) {
                dz = -(dz / Math.abs(dz));
                moon.vz += dz;
            }
        }
    }

    for (let i = 0; i < moons.length; ++i) {
        const moon = moons[i];
        moon.x += moon.vx;
        moon.y += moon.vy;
        moon.z += moon.vz;
    }
}

let energy = 0;
for (let i = 0; i < moons.length; ++i) {
    const moon = moons[i];
    const potentialEnergy = Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
    const kineticEnergy = Math.abs(moon.vx) + Math.abs(moon.vy) + Math.abs(moon.vz);
    energy += potentialEnergy * kineticEnergy;
}

console.log(energy);
