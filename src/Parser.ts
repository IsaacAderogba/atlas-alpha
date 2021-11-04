import { TokenFactory } from "./TokenFactory";

export class Parser {
  private input: string = "";

  parse(input: string) {
    this.input = input;
    return this.Program();
  }

  /**
   * Program
   *  : NumericLiteral
   *  ;
   */
  private Program() {
    return TokenFactory.Program(this.NumericLiteral());
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  private NumericLiteral() {
    return TokenFactory.NumericLiteral(Number(this.input));
  }
}
