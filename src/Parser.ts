import { ASTFactory } from "./ASTFactory";
import { Token, Tokenizer, TokenType } from "./Tokenizer";

export class Parser {
  private tokenizer = new Tokenizer();
  private lookahead: Token | null = null;

  parse(input: string) {
    this.tokenizer.init(input);
    this.lookahead = this.tokenizer.getNextToken();

    return this.Program();
  }

  /**
   * Program
   *  : Literal
   *  ;
   */
  private Program() {
    return ASTFactory.Program(this.Literal());
  }

  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   *  ;
   */
  private Literal() {
    switch (this.lookahead?.type) {
      case TokenType.NUMBER:
        return this.NumericLiteral();
      case TokenType.STRING:
        return this.StringLiteral();
    }
    throw new SyntaxError(`Literal: unexpected literal production`);
  }

  /**
   * StringLiteral
   *  : STRING
   *  ;
   */
  private StringLiteral() {
    const token = this.eat(TokenType.STRING)!;
    return ASTFactory.StringLiteral(token.value.slice(1, -1));
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  private NumericLiteral() {
    const token = this.eat(TokenType.NUMBER)!;
    return ASTFactory.NumericLiteral(Number(token.value));
  }

  private eat(tokenType: TokenType) {
    const token = this.lookahead;

    if (token === null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.type}" expected: "${tokenType}"`
      );
    }

    this.lookahead = this.tokenizer.getNextToken();
    return token;
  }
}
