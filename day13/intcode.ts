export function execute(machineState) {
    machineState.mem.forEach((val, i) => {
        machineState.mem[i] = BigInt(val || 0);
    });

    let pc = machineState.pc || 0;
    machineState.output = undefined;
    machineState.halted = false;
    machineState.relativeBase = BigInt(machineState.relativeBase || 0);

    let mem = machineState.mem;
    let instruction;

    while (mem[pc] !== 99n) {
        readNextInstruction();

        machineState.pc = pc;

        instruction.op(instruction.operands);

        if (machineState.output !== undefined) {
            break;
        }
    }

    machineState.halted = mem[pc] === 99n;
    machineState.pc = pc;

    function readNextInstruction() {
        const value = mem[pc] % 100n;
        const opcode = value > 0n ? value : -value;
        const modes = [];

        let modeFlags = mem[pc] / 100n;
        while (modeFlags > 0) {
            modes.push(modeFlags % 10n);
            modeFlags = modeFlags / 10n;
        }

        instruction = {
            opcode,
            modes
        };

        switch (opcode) {
            case 1n:
                instruction = {
                    ...instruction,
                    opName: "add",
                    op: ({ a, b, out }) => {
                        mem[out] = a + b;
                        pc += 4;
                    },
                    operands: {
                        a: getOperand(0),
                        b: getOperand(1),
                        out: getAddress(2)
                    }
                };
                break;

            case 2n:
                instruction = {
                    ...instruction,
                    opName: "mul",
                    op: ({ a, b, out }) => {
                        mem[out] = a * b;
                        pc += 4;
                    },
                    operands: {
                        a: getOperand(0),
                        b: getOperand(1),
                        out: getAddress(2),
                    }
                };
                break;

            case 3n:
                instruction = {
                    ...instruction,
                    opName: "input",
                    op: ({ out }) => {
                        mem[out] = BigInt(machineState.getInput());
                        pc += 2;
                    },
                    operands: {
                        out: getAddress(0)
                    }
                };
                break;

            case 4n:
                instruction = {
                    ...instruction,
                    opName: "output",
                    op: ({ a }) => {
                        machineState.output = a;
                        pc += 2;
                    },
                    operands: {
                        a: getOperand(0)
                    }
                };
                break;

            case 5n:
                instruction = {
                    ...instruction,
                    opName: "jumpIfTrue",
                    op: ({ a, b }) => {
                        if (a !== 0n) {
                            pc = Number(b);
                        } else {
                            pc += 3;
                        }
                    },
                    operands: {
                        a: getOperand(0),
                        b: getOperand(1)
                    }
                };
                break;

            case 6n:
                instruction = {
                    ...instruction,
                    opName: "jumpIfFalse",
                    op: ({ a, b }) => {
                        if (a === 0n) {
                            pc = Number(b);
                        } else {
                            pc += 3;
                        }
                    },
                    operands: {
                        a: getOperand(0),
                        b: getOperand(1)
                    }
                };
                break;

            case 7n:
                instruction = {
                    ...instruction,
                    opName: "lessThan",
                    op: ({ a, b, out }) => {
                        mem[out] = BigInt((a < b) ? 1 : 0);
                        pc += 4;
                    },
                    operands: {
                        a: getOperand(0),
                        b: getOperand(1),
                        out: getAddress(2)
                    }
                };
                break;

            case 8n:
                instruction = {
                    ...instruction,
                    opName: "equals",
                    op: ({ a, b, out }) => {
                        mem[out] = BigInt((a === b) ? 1 : 0);
                        pc += 4;
                    },
                    operands: {
                        a: getOperand(0),
                        b: getOperand(1),
                        out: getAddress(2)
                    }
                };
                break;

            case 9n:
                instruction = {
                    ...instruction,
                    opName: "setRelativeBase",
                    op: ({ a }) => {
                        machineState.relativeBase += a
                        pc += 2;
                    },
                    operands: {
                        a: getOperand(0)
                    }
                };
                break;

            case 99n:
                instruction = {
                    ...instruction,
                    opName: "halt",
                    op: () => { },
                };
                break;

            default:
                error("Invalid opcode", { opcode, pc });
        }
    }

    function error(message, ...args) {
        console.error(message, ...args);

        throw new Error(message);
    }

    function getAddress(index) {
        const mode = instruction.modes[index] || 0n;

        const operand = mem[pc + index + 1];
        switch (mode) {
            case 0n:
            case 0:
                return operand;

            case 2n:
            case 2:
                return machineState.relativeBase + operand;

            default:
                error("Unrecognized operand mode", { index, mode, instruction, pc });
        }
    }

    function getOperand(index) {
        const mode = instruction.modes[index] || 0n;

        const operand = mem[pc + index + 1];
        switch (mode) {
            case 0n:
            case 0:
            case 2n:
            case 2:
                const address = getAddress(index);
                return BigInt(mem[address] || 0);

            case 1n:
            case 1:
                return BigInt(operand);

            default:
                error("Unrecognized operand mode", { index, mode, instruction, pc });
        }
    }
}
