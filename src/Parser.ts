import { ASTFactory, ASTNodeType } from "./ASTFactory";
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
   *  : StatementList
   *  ;
   */
  private Program() {
    return ASTFactory.Program(this.StatementList());
  }

  /**
   * StatementList
   *  : Statement
   *  | StatementList Statement -> Statement Statement...
   *  ;
   */
  private StatementList(stopLookahead: TokenType | null = null): ASTNodeType[] {
    const statementList = [this.Statement()];

    while (this.lookahead !== null && this.lookahead.type !== stopLookahead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   * Statement
   *  : ExpressionStatement
   *  | BlockStatement
   *  | EmptyStatement
   *  ;
   */
  private Statement(): ASTNodeType {
    switch (this.lookahead?.type) {
      case TokenType.SEMICOLON:
        return this.EmptyStatement();
      case TokenType.LEFT_BRACE:
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * EmptyStatement
   *  : ';'
   *  ;
   */
  private EmptyStatement(): ASTNodeType {
    this.eat(TokenType.SEMICOLON);
    return ASTFactory.EmptyStatement()
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   *  ;
   */
  private BlockStatement(): ASTNodeType {
    this.eat(TokenType.LEFT_BRACE);
    const body =
      this.lookahead?.type !== "}"
        ? this.StatementList(TokenType.RIGHT_BRACE)
        : [];
    this.eat(TokenType.RIGHT_BRACE);

    return ASTFactory.BlockStatement(body);
  }

  /**
   * ExpressionStatement
   *  : Expression ';'
   *  ;
   */
  private ExpressionStatement(): ASTNodeType {
    const expression = this.Expression();
    this.eat(TokenType.SEMICOLON);

    return ASTFactory.ExpressionStatement(expression);
  }

  /**
   * Expression
   *  : Literal
   *  ;
   */
  private Expression(): ASTNodeType {
    return this.Literal();
  }

  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   *  ;
   */
  private Literal(): ASTNodeType {
    switch (this.lookahead?.type) {
      case TokenType.NUMBER:
        return this.NumericLiteral();
      case TokenType.STRING:
        return this.StringLiteral();
      default:
        throw new SyntaxError(`Literal: unexpected literal production`);
    }
  }

  /**
   * StringLiteral
   *  : STRING
   *  ;
   */
  private StringLiteral(): ASTNodeType {
    const token = this.eat(TokenType.STRING)!;
    return ASTFactory.StringLiteral(token.value.slice(1, -1));
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  private NumericLiteral(): ASTNodeType {
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
