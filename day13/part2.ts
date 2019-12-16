import * as fs from "fs";
import { execute } from "./intcode";

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const code = input.split(",").map(s => BigInt(Number.parseInt(s)));

let paddleX = 0;
let ballX = 0;
let score = 0;
const width = 43;
const height = 23;
const board = new Array(width * height);

for (let i = 0; i < width * height; ++i) {
    board[i] = {};
}

// Add 2 quarters.
const mem: any = code.slice();
mem[0] = 2;

const machineState: any = {
    mem,
    getInput: () => {
        if (ballX < paddleX) {
            return -1;
        } else if (ballX > paddleX) {
            return 1;
        } else {
            return 0;
        }
    }
};

let bufferedOutput = [];

while (!machineState.halted) {
    execute(machineState);

    if (machineState.output !== undefined) {
        bufferedOutput.push(machineState.output);
    }

    if (bufferedOutput.length === 3) {
        const [x, y, tile] = bufferedOutput;
        bufferedOutput = [];

        const index = Number(y * BigInt(width) + x);

        if (index === -1) {
            score = tile;
        } else {
            switch (tile) {
                case 3n:
                    paddleX = x;
                    break;

                case 4n:
                    ballX = x;
                    break;
            }

            board[index].tile = tile;
        }
    }
}

printScreen();

function printScreen() {
    console.log(Number(score));

    for (let y = 0; y < height; ++y) {
        let line = "";
        for (let x = 0; x < width; ++x) {
            switch (board[y * width + x].tile) {
                case 0n:
                    line += " ";
                    break;

                case 1n:
                    line += "|";
                    break;

                case 2n:
                    line += "#";
                    break;

                case 3n:
                    line += "_";
                    break;

                case 4n:
                    line += ".";
                    break;
            }
        }

        console.log(line);
    }
}