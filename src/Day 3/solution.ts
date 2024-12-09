import { readFileAsString } from "../utils";

const input: string = readFileAsString(__dirname + "/input.txt");

function findTokens(text: string): string[] {
  return text.match(/mul\(\d+,\d+\)/g) ?? [];
}

function part1(text: string): number {
  const tokens = findTokens(text);
  let result = 0;

  tokens.forEach((token) => {
    const [left, right] = token.split(",");
    const leftValue = parseInt(left.slice(4), 10); // mul(##
    const rightValue = parseInt(right.slice(0, right.length - 1)); // ##)

    result += leftValue * rightValue;
  });

  return result;
}

// remove all text between don't() and do()
// xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
// reduces to:
// xmul(2,4)&mul[3,7]!^                                           ?mul(8,5))
function part2(text: string): number {
  const DONT = "don't()";
  const DO = "do()";

  let dontCursor = text.indexOf(DONT);
  let doCursor = text.indexOf(DO, dontCursor + 1);
  while (dontCursor != -1) {
    if (doCursor == -1) {
      text = text.slice(0, dontCursor);
      break;
    }

    // remove text between don't() and do()
    text = text.slice(0, dontCursor) + text.slice(doCursor + DO.length);
    // reset cursors
    dontCursor = text.indexOf(DONT);
    doCursor = text.indexOf(DO, dontCursor + 1);
  }

  return part1(text);
}

console.log(part2(input));
