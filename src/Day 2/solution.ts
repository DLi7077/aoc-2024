import { readFileAsLines } from "../utils";

const input: number[][] = readFileAsLines(__dirname + "/input.txt").map((line) =>
  line.split(" ").map((x) => parseInt(x, 10))
);

function isDecreasing(values: number[]) {
  for (let idx = 0; idx < values.length - 1; idx++) {
    if (values[idx + 1] >= values[idx]) return false;
  }
  return true;
}

function isIncreasing(values: number[]) {
  for (let idx = 0; idx < values.length - 1; idx++) {
    if (values[idx + 1] <= values[idx]) return false;
  }
  return true;
}

function withinThreshold(values: number[]): boolean {
  for (let idx = 0; idx < values.length - 1; idx++) {
    const gap = Math.abs(values[idx + 1] - values[idx]);
    if (gap > 3) return false;
  }
  return true;
}

function isValid(row: number[]) {
  return (isDecreasing(row) || isIncreasing(row)) && withinThreshold(row);
}

// Solutions 
function part1() {
  return input.filter(isValid).length;
}

function part2() {
  return input.filter((row) => {
    if (isValid(row)) return true;
    const variants: number[][] = row.map((_, idx) => row.filter((_, i) => i != idx));
    return variants.some(isValid);
  }).length;
}

console.log(part2());
