import { readFileAsString } from "../utils";

const input: (number | string)[] = readFileAsString(__dirname + "/input.txt")
  .split("")
  .map(Number)
  .map((value, idx) => {
    if (idx % 2 === 1) return Array(value).fill(".");
    return Array(value).fill(Math.floor(idx / 2));
  })
  .flat();

function moveBlocks(disk: (number | string)[]): (number | string)[] {
  let [spacePtr, filePtr] = [0, input.length - 1];
  while (spacePtr <= filePtr) {
    while (disk[spacePtr] != ".") spacePtr++;
    while (disk[filePtr] == ".") filePtr--;
    if (spacePtr > filePtr) break;

    disk[spacePtr] = disk[filePtr];
    disk[filePtr] = ".";
  }

  return disk;
}

function part1(input: (number | string)[]): number {
  return moveBlocks(input)
    .filter((x) => x !== ".")
    .map((val, idx) => Number(val) * idx)
    .reduce((curr, total) => curr + total, 0);
}

console.log(part1(input));
