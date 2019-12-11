import * as fs from "fs";
import * as gcd from "compute-gcd";
import { findLast } from "lodash";

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const asteroids = [];

input.split("\n").forEach((chars, y) => {
    chars.split("").forEach((char, x) => {
        if (char === "#") {
            asteroids.push({
                x,
                y
            });
        }
    })
});

let bestLocation;
let bestAsteroidsVisible = 0;

asteroids.forEach((location, i) => {
    const visible = {};

    asteroids.forEach(asteroid => {
        if (asteroid !== location) {
            const x = asteroid.x - location.x;
            const y = asteroid.y - location.y;
            const val = gcd(x, y);
            const key = `${x / val}:${y / val}`;

            visible[key] = 1;
        }
    });

    const numVisible = Object.keys(visible).length;

    if (numVisible > bestAsteroidsVisible) {
        bestAsteroidsVisible = numVisible;
        bestLocation = location;
    }
});

const visibleAsteroids = {};

asteroids.forEach(asteroid => {
    if (asteroid === bestLocation) {
        return;
    }

    const x = asteroid.x - bestLocation.x;
    const y = -(asteroid.y - bestLocation.y);
    const val = gcd(x, y);
    const angle = ((((Math.atan2((y / val), (x / val)) / Math.PI) * 180) + 360) % 360).toFixed(10);
    const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    const list = visibleAsteroids[angle] || [];
    list.push({asteroid, distance});
    visibleAsteroids[angle] = list.sort((a, b) => a.distance - b.distance);
});

console.log(visibleAsteroids);

console.log(bestLocation);

let asteroidsDestroyed = 0;
let lastAsteroidDestroyed;
let currentAngle = 90;
while (asteroidsDestroyed < 200) {
    const angles = Object.keys(visibleAsteroids).map(s => Number.parseFloat(s)).sort((a, b) => a - b);
    const angle = findLast(angles, angle => angle <= currentAngle);
    const key = angle.toFixed(10);

    const list = visibleAsteroids[key];
    lastAsteroidDestroyed = list.shift();
    asteroidsDestroyed++;
    console.log(asteroidsDestroyed, lastAsteroidDestroyed, currentAngle, angle);

    currentAngle = ((angle - 0.0000000001) + 360) % 360;

    if (list.length === 0) {
        delete visibleAsteroids[key];
    }
}

console.log(lastAsteroidDestroyed);