export enum TokenType {
  SEMICOLON = ";",
  LEFT_BRACE = "{",
  RIGHT_BRACE = "}",
  LEFT_PAREN = "(",
  RIGHT_PAREN = ")",
  LEFT_BRACKET = "[",
  RIGHT_BRACKET = "]",
  COMMA = ",",
  DOT = ".",

  LET = "let",
  IF = "if",
  ELSE = "else",
  TRUE = "true",
  FALSE = "false",
  NULL = "null",
  WHILE = "while",
  DO = "do",
  FOR = "for",
  DEF = "def",
  RETURN = "return",

  SIMPLE_ASSIGN = "SIMPLE_ASSIGN",
  COMPLEX_ASSIGN = "COMPLEX_ASSIGN",
  ADDITIVE_OPERATOR = "ADDITIVE_OPERATOR",
  MULTIPLICATIVE_OPERATOR = "MULTIPLICATIVE_OPERATOR",
  RELATIONAL_OPERATOR = "RELATIONAL_OPERATOR",
  EQUALITY_OPERATOR = "EQUALITY_OPERATOR",

  LOGICAL_AND = "LOGICAL_AND",
  LOGICAL_OR = "LOGICAL_OR",
  LOGICAL_NOT = "LOGICAL_NOT",

  NUMBER = "NUMBER",
  STRING = "STRING",

  IDENTIFIER = "IDENTIFIER",
}

const TokenSpec = [
  // whitespace, comments
  [/^\s+/, null],
  [/^\/\/.*/, null],
  [/^\/\*[\s\S]*?\*\//, null],

  // symbols, delimiters
  [/^;/, TokenType.SEMICOLON],
  [/^\{/, TokenType.LEFT_BRACE],
  [/^\}/, TokenType.RIGHT_BRACE],
  [/^\(/, TokenType.LEFT_PAREN],
  [/^\)/, TokenType.RIGHT_PAREN],
  [/^,/, TokenType.COMMA],
  [/^\./, TokenType.DOT],
  [/^\[/, TokenType.LEFT_BRACKET],
  [/^\]/, TokenType.RIGHT_BRACKET],

  // keywords
  [/^\blet\b/, TokenType.LET],
  [/^\bif\b/, TokenType.IF],
  [/^\belse\b/, TokenType.ELSE],
  [/^\btrue\b/, TokenType.TRUE],
  [/^\bfalse\b/, TokenType.FALSE],
  [/^\bnull\b/, TokenType.NULL],
  [/^\bwhile\b/, TokenType.WHILE],
  [/^\bdo\b/, TokenType.DO],
  [/^\bfor\b/, TokenType.FOR],
  [/^\bdef\b/, TokenType.DEF],
  [/^\breturn\b/, TokenType.RETURN],

  // Equality Operators
  [/^[=!]=/, TokenType.EQUALITY_OPERATOR],

  // assignment operators
  [/^=/, TokenType.SIMPLE_ASSIGN],
  [/^[\*\/\+\-]=/, TokenType.COMPLEX_ASSIGN],

  // math operators
  [/^[+\-]/, TokenType.ADDITIVE_OPERATOR],
  [/^[*\/]/, TokenType.MULTIPLICATIVE_OPERATOR],

  // relational operators
  [/^[<>]=?/, TokenType.RELATIONAL_OPERATOR],

  // Logical Operators
  [/^&&/, TokenType.LOGICAL_AND],
  [/^\|\|/, TokenType.LOGICAL_OR],
  [/^!/, TokenType.LOGICAL_NOT],

  // literals
  [/^\d+/, TokenType.NUMBER],
  [/^"[^"]*"/, TokenType.STRING],
  [/^'[^']*'/, TokenType.STRING],

  // identifiers
  [/^\w+/, TokenType.IDENTIFIER],
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
