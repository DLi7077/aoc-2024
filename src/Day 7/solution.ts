import { readFileAsLines } from "../utils";

type Equation = {
  target: number;
  terms: number[];
};
const input = readFileAsLines(__dirname + "/input.txt");
const equations: Equation[] = input.map((line) => {
  const [left, right] = line.split(": ");

  return {
    target: parseInt(left, 10),
    terms: right.split(" ").map((x) => parseInt(x, 10)),
  };
});

/*
// assumes elements in candidates are unique
combinations([a,b,c], 4) =
  [a,a,a,a], [a,a,a,b], [a,a,a,c],
  [a,a,b,a], [a,a,b,b], [a,a,b,c],
  [a,a,c,a], [a,a,c,b], [a,a,c,c],
  [a,b,a,a], [a,b,a,b], [a,b,a,c],
  ...
  [c,c,c,a], [c,c,c,b], [c,c,c,d]
*/

enum Operator {
  PLUS,
  TIMES,
  JOIN,
}

function getCombinations<T>(candidates: T[], n: number): T[][] {
  if (n === 0) return [[]];
  const result: T[][] = [];

  for (let idx = 0; idx < candidates.length; idx++) {
    const subCombinations = getCombinations(candidates, n - 1); // [[...[a]], [...[b]]]
    subCombinations.forEach((sub) => result.push([candidates[idx], ...sub]));
  }

  return result;
}

function operatorsCanSolve(equation: Equation, operators: Operator[]): boolean {
  const { target, terms } = equation;
  if (terms.length - 1 != operators.length) throw new Error("What the fuck dude");

  let result = terms[0];
  for (let idx = 0; idx < operators.length; idx++) {
    if (result > target) return false;
    if (operators[idx] === Operator.PLUS) result += terms[idx + 1];
    if (operators[idx] === Operator.TIMES) result *= terms[idx + 1];
    if (operators[idx] === Operator.JOIN) result = parseInt(`${result}${terms[idx + 1]}`);
  }

  return result === target;
}

function part1(equations: Equation[]): number {
  return equations
    .filter((equation) => {
      const operatorCombinations = getCombinations(
        [Operator.PLUS, Operator.TIMES],
        equation.terms.length - 1
      );

      return operatorCombinations.some((combination) => operatorsCanSolve(equation, combination));
    })
    .map((equation) => equation.target)
    .reduce((curr, total) => curr + total, 0);
}

console.time("part 1");
console.log(part1(equations));
console.timeEnd("part 1");

function part2(equations: Equation[]): number {
  return equations
    .filter((equation) => {
      const operatorCombinations = getCombinations(
        [Operator.PLUS, Operator.TIMES, Operator.JOIN],
        equation.terms.length - 1
      );

      return operatorCombinations.some((combination) => operatorsCanSolve(equation, combination));
    })
    .map((equation) => equation.target)
    .reduce((curr, total) => curr + total, 0);
}

console.time("part 2");
console.log(part2(equations));
console.timeEnd("part 2");
