const input = [256310, 732736];

let count = 0;
for (let i = input[0]; i < input[1]; ++i) {
  const digits = i.toString().split("").map(d => parseInt(d));
  
  const double = ((digits[0] === digits[1]) && (digits[1] !== digits[2])) ||
        ((digits[1] === digits[2]) && (digits[2] !== digits[3]) && (digits[1] !== digits[0])) ||
        ((digits[2] === digits[3]) && (digits[3] !== digits[4]) && (digits[2] !== digits[1])) ||
        ((digits[3] === digits[4]) && (digits[4] !== digits[5]) && (digits[3] !== digits[2])) ||
        ((digits[4] === digits[5]) && (digits[4] !== digits[3]));
  
  if (!double) {
    continue;
  }
  
  const increasing = digits[1] >= digits[0] &&
        digits[2] >= digits[1] &&
        digits[3] >= digits[2] &&
        digits[4] >= digits[3] &&
        digits[5] >= digits[4];
  
  if (!increasing) {
    continue;
  }
  
  count++;
}

console.log(count);

