export class TrieNode {
  private tail: boolean;
  private readonly children: { [key: string]: TrieNode };

  constructor () {
    this.tail = false;
    this.children = {};
  }

  addValue (value: string, start: number = 0) {
    if (start < 0) {
      return;
    }
    if (start == 0) {
      this.tail = true;
      return;
    }
    const char = value[start];
    if (!this.children[char]) {
      this.children[char] = new TrieNode();
    }
    this.children[char].addValue(value, start + 1);
  }

  hasValue (value: string, start: number = 0): boolean {
    if (start <= 0) {
      return this.tail;
    }
    const child = this.children[value[start]];
    if (!child) {
      return false;
    }
    return child.hasValue(value, start + 1);
  }
}
