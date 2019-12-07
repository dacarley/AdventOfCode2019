export function execute(machineState) {
    let pc = machineState.pc || 0;
    machineState.output = undefined;
    machineState.halted = false;

    let mem = machineState.mem;
    let instruction;

    while (mem[pc] !== 99) {
        instruction = readNextInstruction();

        instruction.op(instruction);

        if (machineState.output !== undefined) {
            break;
        }
    }

    machineState.halted = mem[pc] === 99;
    machineState.pc = pc;

    function readNextInstruction() {
        const opcode = Math.abs(mem[pc] % 100);
        const modes = [];

        let modeFlags = Math.floor(mem[pc] / 100);
        while (modeFlags > 0) {
            modes.push(modeFlags % 10);
            modeFlags = Math.floor(modeFlags / 10);
        }

        switch (opcode) {
            case 1:
                return {
                    op: add,
                    opcode,
                    modes
                };

            case 2:
                return {
                    op: mul,
                    opcode,
                    modes
                };

            case 3:
                return {
                    op: input,
                    opcode,
                    modes
                };

            case 4:
                return {
                    op: output,
                    opcode,
                    modes
                };

            case 5:
                return {
                    op: jumpIfTrue,
                    opcode,
                    modes
                };

            case 6:
                return {
                    op: jumpIfFalse,
                    opcode,
                    modes
                };

            case 7:
                return {
                    op: lessThan,
                    opcode,
                    modes
                };

            case 8:
                return {
                    op: equals,
                    opcode,
                    modes
                };

            case 99:
                return {
                    op: () => { },
                    opcode,
                    modes
                };

            default:
                error("Invalid opcode", { opcode, pc });
        }
    }

    function error(message, ...args) {
        console.error(message, ...args);

        throw new Error(message);
    }

    function getOperand(index, mode) {
        mode = mode || instruction.modes[index] || 0;

        const operand = mem[pc + index + 1];
        switch (mode) {
            case 0:
                return mem[operand];

            case 1:
                return operand;

            default:
                error("Unrecognized operand mode", { index, mode, instruction, pc });
        }
    }

    function add() {
        const a = getOperand(0);
        const b = getOperand(1);
        const out = getOperand(2, 1);
        mem[out] = a + b;
        pc += 4;
    }

    function mul() {
        const a = getOperand(0);
        const b = getOperand(1);
        const out = getOperand(2, 1);

        mem[out] = a * b;
        pc += 4;
    }

    function input() {
        const out = getOperand(0, 1);

        mem[out] = machineState.input.shift();
        pc += 2;
    }

    function output() {
        machineState.output = getOperand(0);
        pc += 2;
    }

    function jumpIfTrue() {
        const a = getOperand(0);
        const b = getOperand(1);
        if (a !== 0) {
            pc = b;
        } else {
            pc += 3;
        }
    }

    function jumpIfFalse() {
        const a = getOperand(0);
        const b = getOperand(1);
        if (a === 0) {
            pc = b;
        } else {
            pc += 3;
        }
    }

    function lessThan() {
        const a = getOperand(0);
        const b = getOperand(1);
        const out = getOperand(2, 1);
        mem[out] = (a < b) ? 1 : 0;
        pc += 4;
    }

    function equals() {
        const a = getOperand(0);
        const b = getOperand(1);
        const out = getOperand(2, 1);
        mem[out] = (a === b) ? 1 : 0;
        pc += 4;
    }
}
