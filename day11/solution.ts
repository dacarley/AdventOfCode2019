import * as fs from "fs";
import { execute } from "./intcode";

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

export function solution(part) {
    const code = input.split(",").map(s => BigInt(Number.parseInt(s)));

    let numPanelsColored = 0;
    let direction = 0;
    let width = part === 1 ? 100 : 43;
    let height = part === 1 ? 100 : 6;
    let x = part === 1 ? 20 : 0;
    let y = part === 1 ? 50 : 0;
    const grid = new Array(width * height);

    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            grid[y * width + x] = {};
        }
    }

    grid[y * width + x].color = part - 1;

    const machineState: any = {
        mem: code.slice(),
        getInput: () => grid[y * width + x].color || 0
    };

    let colorPanel = false;

    while (!machineState.halted) {
        execute(machineState);

        if (machineState.output !== undefined) {
            colorPanel = !colorPanel;
            const node = grid[y * width + x];

            if (colorPanel) {
                if (node.color === undefined) {
                    numPanelsColored++;
                }
                node.color = machineState.output;
            } else {
                direction = (direction + ((machineState.output ? 1 : -1)) + 4) % 4;
                switch (direction) {
                    case 0:
                        y -= 1;
                        break;

                    case 1:
                        x += 1;
                        break;

                    case 2:
                        y += 1;
                        break;

                    case 3:
                        x -= 1;
                        break;
                }

                if (x < 0) {
                    throw new Error("too far left");
                }

                if (x >= width) {
                    throw new Error("too far right");
                }

                if (y < 0) {
                    throw new Error("too far up");
                }

                if (y >= height) {
                    throw new Error("too far down");
                }
            }
        }
    }

    if (part === 1) {
        console.log(numPanelsColored);
    } else {
        for (let y = 0; y < height; ++y) {
            let line = "";
            for (let x = 0; x < width; ++x) {
                line += grid[y * width + x].color ? "#" : ".";
            }

            console.log(line);
        }
    }
}