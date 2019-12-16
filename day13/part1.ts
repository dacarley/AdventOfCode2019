import * as fs from "fs";
import { execute } from "./intcode";

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const code = input.split(",").map(s => BigInt(Number.parseInt(s)));

const width = 100;
const height = 100;
const board = new Array(width * height);

for (let i = 0; i < width * height; ++i) {
    board[i] = {};
}

const machineState: any = {
    mem: code.slice(),
    getInput: () => { throw new Error("no input") }
};

let bufferedOutput = [];

while (!machineState.halted) {
    execute(machineState);

    if (machineState.output !== undefined) {
        bufferedOutput.push(machineState.output);
    }

    if (bufferedOutput.length === 3) {
        const [x, y, tile] = bufferedOutput;

        switch (tile) {
            case 0n:
            case 1n:
            case 2n:
            case 3n:
            case 4n:
                const index = Number(y * BigInt(width) + x);
                console.log(tile);
                board[index].tile = tile;
                bufferedOutput = [];
                break;

            default:
                console.log(tile);
                throw new Error("unknown tile type");
        }
    }
}

let numBlockTiles = 0;
board.forEach(cell => {
    numBlockTiles += cell.tile === 2n ? 1 : 0;
})

console.log(numBlockTiles);