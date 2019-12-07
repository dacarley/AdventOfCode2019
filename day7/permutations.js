function swap(numbers, a, b) {
    const temp = numbers[a];
    numbers[a] = numbers[b];
    numbers[b] = temp;
}

export function generatePermutations(numbers, start, end) {
    const permutations = [];

    permutation(numbers, start, end);

    return permutations;

    function permutation(numbers, start, end) {
        if (start === end) {
            permutations.push(numbers.slice());
            return;
        }

        for (let i = start; i <= end; i++) {
            swap(numbers, i, start);
            permutation(numbers, start + 1, end);
            swap(numbers, i, start);
        }
    }
}