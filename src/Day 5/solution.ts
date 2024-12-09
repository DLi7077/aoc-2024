import { NEW_LINE as LN, readFileAsString } from "../utils";

const input: string = readFileAsString(__dirname + "/input.txt");

const [orderString, listString] = input.split(LN + LN);
const orderRules: number[][] = orderString
  .split(LN)
  .map((line) => line.split("|").map((x) => parseInt(x, 10)));
const lists: number[][] = listString
  .split(LN)
  .map((row) => row.split(",").map((x) => parseInt(x, 10)));

function matchesOrder(orderRules: number[][], list: number[]): boolean {
  const listOrderMapping = new Map<number, number>();
  list.forEach((x, idx) => listOrderMapping.set(x, idx));

  return orderRules.every(([left, right]) => {
    const leftIdx = listOrderMapping.get(left) ?? -1;
    const rightIdx = listOrderMapping.get(right) ?? -1;
    return leftIdx <= rightIdx || leftIdx == -1 || rightIdx == -1;
  });
}

function getMiddleElement(list: number[]): number {
  return list[Math.floor(list.length / 2)];
}

function part1(orderRules: number[][], lists: number[][]) {
  return lists
    .filter((list) => matchesOrder(orderRules, list))
    .map(getMiddleElement)
    .reduce((curr, total) => total + curr, 0);
}

function part2(orderRules: number[][], lists: number[][]) {
  const wrongOrderLists = lists.filter(
    (list) => !matchesOrder(orderRules, list)
  );

  const lessThanMapping = new Map<number, number[]>();
  orderRules.forEach(([left, right]) => {
    if (!lessThanMapping.has(left)) lessThanMapping.set(left, []);
    lessThanMapping.get(left)?.push(right);
  });

  wrongOrderLists.forEach((list) =>
    list.sort((a, b) => (lessThanMapping.get(a)?.includes(b) ? -1 : 1))
  );

  return wrongOrderLists
    .map(getMiddleElement)
    .reduce((curr, total) => total + curr, 0);
}

console.log(part1(orderRules, lists));

console.log(part2(orderRules, lists));