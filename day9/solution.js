import { execute } from "./intcode.js";
import fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function (inputValue) {
    const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

    const machineState = {
        mem: input.split(",").map(n => BigInt(n)),
        input: [inputValue]
    };

    while (!machineState.halted) {
        execute(machineState);

        if (machineState.output !== undefined) {
            console.log(machineState.output);
        }
    }
}