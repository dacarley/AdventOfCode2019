import * as fs from "fs";

export default function (fuelAmount) {
    const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");
    const lines = input.split("\n");

    const mappings = {}

    const pattern = /(\d+) ([A-Z]+)/g;

    lines.forEach(line => {
        const items = line.match(pattern).map(parse);
        const output = items[items.length - 1];
        const inputs = items.slice(0, items.length - 1);

        mappings[output.name] = {
            number: output.number,
            stock: 0,
            inputs
        };
    });

    mappings["ORE"] = {
        stock: 0
    }

    produce("FUEL", fuelAmount);

    return mappings["ORE"].stock;

    function produce(name, desiredNumber): any {
        if (name === "ORE") {
            mappings["ORE"].stock += desiredNumber;

            return;
        }

        const { number, stock, inputs } = mappings[name];

        const needed = desiredNumber - stock;
        if (needed > 0) {
            const multiplier = Math.ceil(needed / number);
            inputs.forEach(input => {
                produce(input.name, multiplier * input.number);
            });

            mappings[name].stock += multiplier * number;
        }

        mappings[name].stock -= desiredNumber;
    }

    function parse(numberAndName) {
        const [number, name] = numberAndName.split(" ");

        return {
            number: Number(number),
            name
        }
    }
}