import fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const width = 25;
const height = 6;

const layerSize = width * height;
const numLayers = input.length / layerSize;

let leastZeros = Number.MAX_SAFE_INTEGER;
let layerWithLeastZeros;
for (let i = 0; i < numLayers; ++i) {
    const layer = input.slice(i * layerSize, (i + 1) * layerSize).split("");

    const numZeros = layer.reduce((sum, ch) => sum += ch === "0" ? 1 : 0, 0);
    if (numZeros < leastZeros) {
        leastZeros = numZeros;
        layerWithLeastZeros = layer;
    }
}

const numOnes = layerWithLeastZeros.reduce((sum, ch) => sum += ch === "1" ? 1 : 0, 0);
const numTwos = layerWithLeastZeros.reduce((sum, ch) => sum += ch === "2" ? 1 : 0, 0);

console.log(numOnes * numTwos);
