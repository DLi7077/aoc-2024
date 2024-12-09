import fs from "fs";

export const NEW_LINE = "\r\n"
export function readFileAsString(filePath: string): string {
  return fs.readFileSync(filePath).toString("utf-8");
}

export function readFileAsLines(filePath: string): string[] {
  return fs.readFileSync(filePath).toString("utf-8").split(NEW_LINE);
}
