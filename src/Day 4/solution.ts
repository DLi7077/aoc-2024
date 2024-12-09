import { readFileAsLines } from "../utils";

type TrieNode = {
  next: TrieNode[];
  complete: boolean;
};

const input: string[][] = readFileAsLines(__dirname + "/input.txt").map(
  (line) => line.split("").map((letter) => letter.toLowerCase())
);
function createTrieNode(): TrieNode {
  return {
    next: Array(26).fill(null),
    complete: false,
  };
}

const getCharacterIndex = (letter: string): number =>
  letter.toLowerCase().charCodeAt(0) - "a".charCodeAt(0);

function constructTrie(words: string[]): TrieNode {
  const root = createTrieNode();
  for (const word of words) {
    let branch = root;
    for (const letter of word.split("")) {
      const letterIdx = getCharacterIndex(letter);
      if (!branch.next[letterIdx]) {
        branch.next[letterIdx] = createTrieNode();
      }
      branch = branch.next[letterIdx];
    }
    branch.complete = true;
  }
  return root;
}

function inBounds(grid: string[][], coords: [number, number]): boolean {
  const [row, col] = coords;
  return 0 <= row && row < grid.length && 0 <= col && col < grid[0].length;
}

// given state, position, and direction, returns number of matches from location
function dfs(
  grid: string[][],
  trieNode: TrieNode,
  [row, col]: [number, number],
  [x, y]: [number, number]
): number {
  if (!inBounds(grid, [row, col])) return 0;

  const letter = grid[row][col];
  const letterIdx = getCharacterIndex(letter);
  trieNode = trieNode.next[letterIdx];
  if (trieNode?.complete) return 1;
  if (!trieNode) return 0;

  grid[row][col] = "_";
  const [nextRow, nextCol] = [row + x, col + y];
  let result = dfs(grid, trieNode, [nextRow, nextCol], [x, y]);
  grid[row][col] = letter;

  return result;
}

function part1(grid: string[][]): number {
  const directions: [number, number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const trieDictionary = constructTrie(["xmas"]);
  let result = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const branch = trieDictionary;
      for (const direction of directions) {
        result += dfs(grid, branch, [row, col], direction);
      }
    }
  }

  return result;
}

// console.log(part1(input));

// take 3 x 3
// check that both diagonals are MAS in either direction

function part2(grid: string[][]): number {
  const trieDictionary = constructTrie(["mas"]);
  const subGridSize = 3;

  let result = 0;
  for (let row = 0; row <= grid.length - subGridSize; row++) {
    for (let col = 0; col <= grid[0].length - subGridSize; col++) {
      const subgrid = pickNxN(grid, row, col, subGridSize);

      let xmasCount = 0;
      // top left
      xmasCount += dfs(subgrid, trieDictionary, [0, 0], [1, 1]);
      // bottom left
      xmasCount += dfs(subgrid, trieDictionary, [subGridSize - 1, 0], [-1, 1]);
      // top right
      xmasCount += dfs(subgrid, trieDictionary, [0, subGridSize - 1], [1, -1]);
      // bottom right
      xmasCount += dfs(
        subgrid,
        trieDictionary,
        [subGridSize - 1, subGridSize - 1],
        [-1, -1]
      );
      if (xmasCount == 2) result++;
    }
  }

  return result;
}

function pickNxN(
  grid: string[][],
  startRow: number,
  startCol: number,
  n: number
) {
  const result: string[][] = [];
  for (let row = startRow; row < startRow + n; row++) {
    result.push(grid[row].slice(startCol, startCol + n));
  }
  return result;
}

console.log(part2(input));
