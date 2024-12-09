import { readFileAsLines } from "../utils";

const OBSTACLE = "#";
const CURSOR = "^";
const VISITED = "X";
const input = readFileAsLines(__dirname + "/input.txt").map((line) => line.split(""));
const { log } = console;
function findStart(grid: string[][]): [number, number] {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === CURSOR) return [row, col];
    }
  }

  throw new Error("Where the fuck is it?");
}

function inBounds(grid: string[][], coords: [number, number]): boolean {
  const [row, col] = coords;
  return 0 <= row && row < grid.length && 0 <= col && col < grid[0].length;
}

function countVisited(grid: string[][]): number {
  return grid.flat().filter((cell) => cell === VISITED).length;
}

function part1(grid: string[][]): number {
  const directions: [number, number][] = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ];

  let directionIdx = 0;
  let [row, col] = findStart(grid);
  grid[row][col] = VISITED;
  while (true) {
    const [rowStep, colStep] = directions[directionIdx];
    const [nextRow, nextCol] = [row + rowStep, col + colStep];

    if (!inBounds(grid, [nextRow, nextCol])) break;

    if (grid[nextRow][nextCol] === OBSTACLE) {
      directionIdx = (directionIdx + 1) % 4;
      continue;
    }
    grid[nextRow][nextCol] = VISITED;

    row = nextRow;
    col = nextCol;
  }

  return countVisited(input);
}

// console.log(part1(input));
// console.log(
//   JSON.stringify(input).replaceAll("],[", "\n").replaceAll("[[", "").replaceAll("]]", "")
// );

function travelUntilLoop(grid: string[][], start: [number, number]): boolean {
  const travelSet = new Set<string>();
  const directions: [number, number][] = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ];

  let directionIdx = 0;
  let [row, col] = start;
  while (true) {
    const [rowStep, colStep] = directions[directionIdx];
    const [nextRow, nextCol] = [row + rowStep, col + colStep];

    if (!inBounds(grid, [nextRow, nextCol])) break;

    if (grid[nextRow][nextCol] === OBSTACLE) {
      directionIdx = (directionIdx + 1) % 4;
      continue;
    }
    const stateCode = `${nextRow},${nextCol},${directionIdx}`;
    if (travelSet.has(stateCode)) return true;
    travelSet.add(`${nextRow},${nextCol},${directionIdx}`);

    row = nextRow;
    col = nextCol;
  }

  return false;
}

function part2(grid: string[][]) {
  let result = 0;
  const start = findStart(grid);
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      console.log(row, col);
      if (row == start[0] && col == start[1]) continue;
      const originalCell = grid[row][col];

      grid[row][col] = OBSTACLE;
      if (travelUntilLoop(grid, start)) result++;
      grid[row][col] = originalCell;
    }
  }

  return result;
}

console.log(part2(input));
