import { readFileAsLines } from "../utils";

const input = readFileAsLines(__dirname + "/input.txt").map((line) => line.split("").map(Number));

console.log(input);
function inBounds(grid: number[][], coords: [number, number]): boolean {
  const [row, col] = coords;
  return 0 <= row && row < grid.length && 0 <= col && col < grid[0].length;
}

const directions: [number, number][] = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

function bfs(grid: number[][], queue: [number, number][]): number {
  let result = 0;
  const visited = new Set<string>();
  while (queue.length != 0) {
    const currCell = queue.shift()!;
    const [row, col] = currCell;
    const value = grid[row][col];
    for (const [x, y] of directions) {
      const [nextRow, nextCol] = [row + x, col + y];

      if (!inBounds(grid, [nextRow, nextCol])) continue;

      if (grid[nextRow][nextCol] === value + 1) {
        if (grid[nextRow][nextCol] === 9) {
          // >>> only change for part 2
          const coordString = `${nextRow},${nextCol}`;
          if (visited.has(coordString)) continue;
          visited.add(coordString);
          // <<< only change for part 2

          result++;
          continue;
        }
        queue.push([nextRow, nextCol]);
      }
    }
  }

  return result;
}

function part1(grid: number[][]): number {
  let result = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === 0) result += bfs(grid, [[row, col]]);
    }
  }

  return result;
}

console.log(part1(input));

function bfs2(grid: number[][], queue: [number, number][]): number {
  let result = 0;
  while (queue.length != 0) {
    const currCell = queue.shift()!;
    const [row, col] = currCell;
    const value = grid[row][col];
    for (const [x, y] of directions) {
      const [nextRow, nextCol] = [row + x, col + y];

      if (!inBounds(grid, [nextRow, nextCol])) continue;

      if (grid[nextRow][nextCol] === value + 1) {
        if (grid[nextRow][nextCol] === 9) {
          result++;
          continue;
        }
        queue.push([nextRow, nextCol]);
      }
    }
  }

  return result;
}

function part2(grid: number[][]): number {
  let result = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === 0) result += bfs2(grid, [[row, col]]);
    }
  }

  return result;
}

console.log(part2(input));
