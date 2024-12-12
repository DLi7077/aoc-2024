import { readFileAsString } from "../utils";

const input = readFileAsString(__dirname + "/input.txt")
  .split(" ")
  .map(Number);

function part1(rocks: number[], iterations: number) {
  // cache[n][rock] tells how many rocks are created from that rock at the nth iteration
  const cache: any[] = Array(iterations + 1)
    .fill(null)
    .map((_) => ({}));

  rocks.forEach((rock) => solve(cache, rock, iterations));

  return rocks.map((rock) => cache[iterations][rock]).reduce((curr, total) => curr + total, 0);
}

function solve(cache: any, rock: number, iterations: number) {
  if (iterations === 0) return 1;
  if (cache[iterations][rock]) return cache[iterations][rock];

  const nextRocks = evaluate(rock);
  let currentIterationResult = 0;
  nextRocks.forEach((nextRock) => {
    currentIterationResult += solve(cache, nextRock, iterations - 1);
  });
  
  cache[iterations][rock] = currentIterationResult;
  return currentIterationResult;
}

function evaluate(rock: number): number[] {
  if (rock === 0) return [1];
  const rockString = `${rock}`;
  if (rockString.length % 2 == 0)
    return [
      rockString.slice(0, rockString.length / 2),
      rockString.slice(rockString.length / 2),
    ].map(Number);
  return [rock * 2024];
}

console.log(part1(input, 25)); // 204022
console.log(part1(input, 75)); // 241651071960597
