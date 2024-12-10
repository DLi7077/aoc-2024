import { readFileAsString } from "../utils";

const input: string = readFileAsString(__dirname + "/input.txt");

type Unit = {
  fileId: number | string; // set to '.' if space
  size: number;
};

type DLLNode<T> = {
  prev: DLLNode<T> | null;
  curr: T;
  next: DLLNode<T> | null;
};

function setNext<T>(currNode: DLLNode<T> | null, nextNode: DLLNode<T> | null): void {
  if (!!currNode) currNode.next = nextNode;
  if (!!nextNode) nextNode.prev = currNode;
}

function setPrev<T>(currNode: DLLNode<T> | null, prevNode: DLLNode<T> | null): void {
  if (!!currNode) currNode.prev = prevNode;
  if (!!prevNode) prevNode.next = currNode;
}

function getBack<T>(node: DLLNode<T>): DLLNode<T> | null {
  let ptr = node;
  while (ptr && ptr.next) {
    ptr = ptr.next;
  }

  return ptr;
}

function createMemoryStream(input: string): DLLNode<Unit> {
  const dummyHead: DLLNode<Unit> = { prev: null, curr: { fileId: 0, size: 0 }, next: null };
  let ptr = dummyHead;

  input
    .split("")
    .map(Number)
    .map((value, idx): Unit => {
      if (idx % 2 === 1) return { fileId: ".", size: value };
      return { fileId: Math.floor(idx / 2), size: value };
    })
    .filter(({ size }) => size != 0)
    .map((unit) => ({ prev: null, curr: unit } as DLLNode<Unit>))
    .forEach((node) => {
      setNext(ptr, node);
      setPrev(node, ptr);

      ptr = ptr.next!;
    });

  return dummyHead.next!;
}

function print(node: DLLNode<Unit> | null): void {
  let ptr: DLLNode<Unit> | null = node;
  let result: any[] = [];
  while (!!ptr) {
    console.log(ptr.curr);
    result.push(`${ptr.curr.fileId}`.repeat(ptr.curr.size));
    ptr = ptr.next;
  }

  console.log(result.join(""));
}

function toString(node: DLLNode<Unit> | null): string {
  let ptr: DLLNode<Unit> | null = node;
  let result: any[] = [];
  while (!!ptr) {
    result.push(`${ptr.curr.fileId}`.repeat(ptr.curr.size));
    ptr = ptr.next;
  }

  return result.join("");
}

function nextAvailableSpaceUnit(head: DLLNode<Unit>, tailor: DLLNode<Unit>): DLLNode<Unit> | null {
  let ptr: DLLNode<Unit> | null = head;
  while (ptr) {
    if (ptr.curr.fileId == tailor.curr.fileId) return null;
    if (ptr.curr.fileId === "." && ptr.curr.size >= tailor.curr.size) {
      return ptr;
    }
    ptr = ptr.next;
  }

  return ptr;
}

function joinWithNeighboringSpaces(ptr: DLLNode<Unit>): void {
  let leftingPtr = ptr.prev;
  let rightingPtr = ptr.next;

  if (leftingPtr && leftingPtr.curr.fileId === ".") {
    setNext(leftingPtr.prev, ptr);
    setPrev(ptr, leftingPtr.prev);

    ptr.curr.size += leftingPtr.curr.size;
    leftingPtr.curr.size = 0;
  }
  if (rightingPtr && rightingPtr.curr.fileId === ".") {
    setNext(ptr, rightingPtr.next);
    setPrev(rightingPtr.next, ptr);
    ptr.curr.size += rightingPtr.curr.size;
    rightingPtr.curr.size = 0;
  }

  // setPrev(rightingPtr, ptr);
  // setNext(ptr, rightingPtr);

  console.log({ leftingPtr: leftingPtr?.curr, ptr: ptr.curr, rightingPtr: rightingPtr?.curr });
}

function repeat(memoryStream: DLLNode<Unit>): DLLNode<Unit> {
  let state = toString(memoryStream);
  while (true) {
    const updatedState = toString(update(memoryStream));
    console.log(updatedState);
    if (updatedState === state) return memoryStream;
    state = updatedState;
  }
}

function update(memoryStream: DLLNode<Unit>): DLLNode<Unit> {
  const headPtr = memoryStream;
  let filePtr = getBack(memoryStream);

  while (filePtr) {
    console.log(filePtr.curr);
    if (filePtr.curr.fileId === ".") {
      console.log("skipping space");
      filePtr = filePtr.prev;
      continue;
    }
    const matchedSpaceUnit = nextAvailableSpaceUnit(headPtr, filePtr);
    // console.log({matchedSpaceUnit});

    if (!matchedSpaceUnit) {
      console.log("no match found");
      filePtr = filePtr.prev;
      continue;
    }

    console.log({ file: filePtr.curr, space: matchedSpaceUnit.curr });
    const spaceLeft = matchedSpaceUnit.curr.size - filePtr.curr.size;
    const { fileId, size } = filePtr.curr;

    print(memoryStream);

    // replace file unit ptr with spaces
    filePtr.curr.fileId = ".";

    // update space unit ptr
    matchedSpaceUnit.curr.size = spaceLeft;

    // create file unit node behind space node
    const movedFileUnit: DLLNode<Unit> = {
      prev: null,
      curr: { fileId, size },
      next: null,
    };

    if (spaceLeft > 0) {
      // ?? <-> space(3) <-> ??
      // ?? <-> {file(2)} <-> space(1) -> ??
      setNext(matchedSpaceUnit.prev, movedFileUnit);
      setNext(movedFileUnit, matchedSpaceUnit);
      // join with neighboring spaces

      // join()
    } else {
      // ?? <-> space(2) <-> ??
      // ?? <-> {file(2)} <-> ??
      setNext(matchedSpaceUnit.prev, movedFileUnit);
      setNext(movedFileUnit, matchedSpaceUnit.next);
    }

    console.log({ file: filePtr.curr }, "join");
    joinWithNeighboringSpaces(filePtr);
    print(memoryStream);

    // print(headPtr);

    filePtr = filePtr.prev;
  }

  return memoryStream;
}

function part2() {
  const memoryStream: DLLNode<Unit> = createMemoryStream(input);
  const result = update(memoryStream);
  print(memoryStream);

  return compute(result);
}

function compute(memoryStream: DLLNode<Unit>): number {
  let ptr: DLLNode<Unit> | null = memoryStream;
  let result = 0;
  let idx = 0;

  while (!!ptr) {
    const { fileId, size } = ptr.curr;
    if (fileId === ".") {
      idx += size;
      ptr = ptr.next;
      continue;
    }
    for (let count = 0; count < size; count++) {
      console.log(`${Number(fileId)} * ${idx} = ${Number(fileId) * idx}`);
      result += Number(fileId) * idx;
      idx++;
    }

    ptr = ptr.next;
  }

  return result;
}

console.log(part2());
