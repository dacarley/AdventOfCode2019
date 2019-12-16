import getOreAmount from "./solution";

const oneFuelOre = getOreAmount(1);

const oreSupply = 1e12;

let lower = Math.floor(oreSupply / oneFuelOre);
let upper = lower * 2;

while (upper - lower > 1) {
    let target = Math.floor((lower + upper) / 2);

    const oreNeeded = getOreAmount(target);
    if (oreNeeded > oreSupply) {
        upper = target;
    } else {
        lower = target;
    }
}

console.log(lower);