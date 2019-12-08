import fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const width = 25;
const height = 6;

const layerSize = width * height;
const numLayers = input.length / layerSize;

const image = [];

for (let i = 0; i < layerSize; ++i) {
    image.push(" ");
}

for (let i = numLayers - 1; i >= 0; --i) {
    const layer = input.slice(i * layerSize, (i + 1) * layerSize).split("");

    layer.forEach((ch, i) => {
        if (ch !== "2") {
            image[i] = ch === "1" ? "*" : " ";
        }
    })
}

for (let i = 0; i < height; ++i) {
    console.log(image.slice(i * width, (i + 1) * width).join(""));
}
