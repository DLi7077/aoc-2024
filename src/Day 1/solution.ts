import { readFileAsLines } from "../utils";

const input: string[] = readFileAsLines(__dirname + "/input.txt");

// https://adventofcode.com/2024/day/1

function part1(): number {
  const leftList: number[] = [];
  const rightList: number[] = [];

  input.forEach((val) => {
    const [left, right] = val.split("   ");

    leftList.push(parseInt(left));
    rightList.push(parseInt(right));
  });

  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);

  const listLength = input.length;
  let result = 0;
  for (let idx = 0; idx < listLength; idx++) {
    result += Math.abs(rightList[idx] - leftList[idx]);
  }

  return result;
}

function part2(): number {
  const leftList: number[] = [];
  const rightList: number[] = [];

  input.forEach((val) => {
    const [left, right] = val.split("   ");

    leftList.push(parseInt(left));
    rightList.push(parseInt(right));
  });

  const freqMap: Map<number, number> = new Map();
  rightList.forEach((val) => {
    const updatedCount = (freqMap.get(val) ?? 0) + 1;
    freqMap.set(val, updatedCount);
  });

  let result: number = 0;
  leftList.forEach((val) => (result += val * (freqMap.get(val) ?? 0)));

  return result;
}

console.log(part2());
