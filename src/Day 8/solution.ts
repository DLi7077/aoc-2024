import { readFileAsLines } from "../utils";

const input = readFileAsLines(__dirname + "/input.txt").map((line) => line.split(""));

function inBounds(grid: string[][], coords: [number, number]): boolean {
  const [row, col] = coords;
  return 0 <= row && row < grid.length && 0 <= col && col < grid[0].length;
}

function createAntennaGrid(rows: number, columns: number) {
  return Array(rows)
    .fill(null)
    .map((_) => Array(columns).fill(false));
}

function getExtendedCoordinates(
  coords: [number, number],
  nextCoords: [number, number]
): [number, number] {
  const xGap = coords[0] - nextCoords[0];
  const yGap = coords[1] - nextCoords[1];

  return [nextCoords[0] - xGap, nextCoords[1] - yGap];
}

function part1(grid: string[][]): number {
  const locationMapping = new Map<string, [number, number][]>();
  const antennaGrid = createAntennaGrid(grid.length, grid[0].length);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const currCell = grid[row][col];
      if ([".", "#"].includes(currCell)) continue;
      if (!locationMapping.has(currCell)) locationMapping.set(currCell, []);
      const otherLocations = locationMapping.get(currCell)!;

      const extendedCoordinates = otherLocations
        .map((location) => [
          getExtendedCoordinates([row, col], location),
          getExtendedCoordinates(location, [row, col]),
        ])
        .flat()
        .filter((coords) => inBounds(grid, coords));

      extendedCoordinates.forEach(([x, y]) => (antennaGrid[x][y] = true));
      locationMapping.get(currCell)?.push([row, col]);
    }
  }

  return antennaGrid.flat().reduce((curr, total) => curr + total);
}

console.time("part 1");
console.log(part1(input));
console.timeEnd("part 1");

// part 2

function getExtendedCoordinates2(
  grid: string[][],
  coords: [number, number],
  nextCoords: [number, number]
): [number, number][] {
  const xGap = coords[0] - nextCoords[0];
  const yGap = coords[1] - nextCoords[1];
  const result: [number, number][] = [coords];

  let [currX, currY] = nextCoords;
  while (inBounds(grid, [currX - xGap, currY - yGap])) {
    currX -= xGap;
    currY -= yGap;

    result.push([currX, currY]);
  }

  return result;
}

function part2(grid: string[][]): number {
  const locationMapping = new Map<string, [number, number][]>();
  const antennaGrid = createAntennaGrid(grid.length, grid[0].length);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const currCell = grid[row][col];
      if ([".", "#"].includes(currCell)) continue;
      if (!locationMapping.has(currCell)) locationMapping.set(currCell, []);
      const otherLocations = locationMapping.get(currCell)!;

      const extendedCoordinates = otherLocations
        .map((location) => [
          getExtendedCoordinates2(grid, [row, col], location),
          getExtendedCoordinates2(grid, location, [row, col]),
        ])
        .flat(2)
        .filter((coords) => inBounds(grid, coords));

      extendedCoordinates.forEach(([x, y]) => {
        antennaGrid[x][y] = true;
        if (grid[x][y] != ".") return;
        grid[x][y] = "#";
      });
      locationMapping.get(currCell)?.push([row, col]);
    }
  }

  return antennaGrid.flat().filter((x) => !!x).length;
}

console.time("part 2");
console.log(part2(input));
console.timeEnd("part 2");
