export enum TokenType {
  // literals
  NUMBER = "NUMBER",
  STRING = "STRING",
}

const TokenSpec = [
  [/^\s+/, null],
  [/^\/\/.*/, null],
  [/^\/\*[\s\S]*?\*\//, null],

  [/^\d+/, TokenType.NUMBER],
  [/^"[^"]*"/, TokenType.STRING],
  [/^'[^']*'/, TokenType.STRING],
] as const;

export interface Token {
  type: TokenType;
  value: string;
}

export class Tokenizer {
  private input: string = "";
  private cursor: number = 0;

  init(input: string) {
    this.input = input;
    this.cursor = 0;
  }

  getNextToken(): { type: TokenType; value: string } | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this.input.slice(this.cursor);
    for (const [regexp, type] of TokenSpec) {
      const value = this.match(regexp, string);

      if (value == null) {
        continue;
      }

      if (type == null) {
        return this.getNextToken();
      }

      return { type, value };
    }

    throw new SyntaxError(`Unexpected token: "${string[0]}"`);
  }

  private match(regexp: RegExp, string: string) {
    const matched = regexp.exec(string);
    if (matched == null) {
      return null;
    }

    this.cursor += matched[0].length;
    return matched[0];
  }

  private hasMoreTokens() {
    return this.cursor < this.input.length;
  }
}
