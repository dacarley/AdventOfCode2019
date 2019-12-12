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

const initialState = JSON.parse(JSON.stringify(moons));

let x = 0;
let y = 0;
let z = 0;
let i = 0;

while (!x || !y || !z) {
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

    ++i;
    if (!x && done("x", "vx")) {
        x = i;
    }

    if (!y && done("y", "vy")) {
        y = i;
    }

    if (!z && done("z", "vz")) {
        z = i;
    }
}

function gcd(numbers) {
    return numbers.reduce(function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    });
}

function lcm(numbers) {
    return numbers.reduce(function (a, b) {
        return Math.abs(a * b) / gcd([a, b]);
    });
}

console.log({
    x,
    y,
    z,
    lcm: lcm([x, y, z])
});

function done(pos, vel) {
    return moons[0][pos] === initialState[0][pos] &&
        moons[0][vel] === initialState[0][vel] &&
        moons[1][pos] === initialState[1][pos] &&
        moons[1][vel] === initialState[1][vel] &&
        moons[2][pos] === initialState[2][pos] &&
        moons[2][vel] === initialState[2][vel] &&
        moons[3][pos] === initialState[3][pos] &&
        moons[3][vel] === initialState[3][vel];
}