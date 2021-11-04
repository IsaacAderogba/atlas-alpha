import { ASTFactory, ASTNode } from "./ASTFactory";
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
   *  | StatementList Statement
   *  ;
   */
  private StatementList(stopLookahead: TokenType | null = null): ASTNode[] {
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
  private Statement(): ASTNode {
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
  private EmptyStatement(): ASTNode {
    this.eat(TokenType.SEMICOLON);
    return ASTFactory.EmptyStatement();
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   *  ;
   */
  private BlockStatement(): ASTNode {
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
  private ExpressionStatement(): ASTNode {
    const expression = this.Expression();
    this.eat(TokenType.SEMICOLON);

    return ASTFactory.ExpressionStatement(expression);
  }

  /**
   * Expression
   *  : AdditiveExpression
   *  ;
   */
  private Expression(): ASTNode {
    return this.AdditiveExpression();
  }

  /**
   * AdditiveExpression
   *  : MultiplicativeExpression
   *  | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression
   *  ;
   */
  private AdditiveExpression(): ASTNode {
    return this.BinaryExpression(
      () => this.MultiplicativeExpression(),
      TokenType.ADDITIVE_OPERATOR
    );
  }

  /**
   * MultiplicativeExpression
   *  : PrimaryExpression
   *  | MultiplicativeExpression ADDITIVE_OPERATOR PrimaryExpression
   *  ;
   */
  private MultiplicativeExpression(): ASTNode {
    return this.BinaryExpression(
      () => this.PrimaryExpression(),
      TokenType.MULTIPLICATIVE_OPERATOR
    );
  }

  private BinaryExpression(callback: () => ASTNode, operatorToken: TokenType) {
    let left = callback();

    while (this.lookahead?.type === operatorToken) {
      const operator = this.eat(operatorToken).value;
      const right = callback();

      left = ASTFactory.BinaryExpression(operator, left, right);
    }

    return left;
  }

  /**
   * PrimaryExpression
   *  : Literal
   *  | ParenthesizedExpression
   *  ;
   */
  private PrimaryExpression(): ASTNode {
    switch (this.lookahead?.type) {
      case TokenType.LEFT_PAREN:
        return this.ParenthesizedExpression();
      default:
        return this.Literal();
    }
  }

  /**
   * ParenthesizedExpression
   *  : '(' Expression ')'
   *  ;
   */
  private ParenthesizedExpression(): ASTNode {
    this.eat(TokenType.LEFT_PAREN);
    const expression = this.Expression();
    this.eat(TokenType.RIGHT_PAREN);

    return expression;
  }

  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   *  ;
   */
  private Literal(): ASTNode {
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
  private StringLiteral(): ASTNode {
    const token = this.eat(TokenType.STRING)!;
    return ASTFactory.StringLiteral(token.value.slice(1, -1));
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  private NumericLiteral(): ASTNode {
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
