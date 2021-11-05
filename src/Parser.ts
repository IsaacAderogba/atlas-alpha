import { ASTFactory, ASTNode, ASTNodeType } from "./ASTFactory";
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
   *  | VariableStatement
   *  | IfStatement
   *  ;
   */
  private Statement(): ASTNode {
    switch (this.lookahead?.type) {
      case TokenType.SEMICOLON:
        return this.EmptyStatement();
      case TokenType.IF:
        return this.IfStatement();
      case TokenType.LEFT_BRACE:
        return this.BlockStatement();
      case TokenType.LET:
        return this.VariableStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * IfStatement
   *  : 'if' '(' Expression ')' Statement
   *  | 'if' '(' Expression ')' Statement 'else' Statement
   *  ;
   */
  private IfStatement(): ASTNode {
    this.eat(TokenType.IF);

    this.eat(TokenType.LEFT_PAREN);
    const test = this.Expression();
    this.eat(TokenType.RIGHT_PAREN);

    const consequent = this.Statement();
    const alternate =
      this.lookahead != null && this.lookahead.type === TokenType.ELSE
        ? this.eat(TokenType.ELSE) && this.Statement()
        : null;

    return ASTFactory.IfStatement(test, consequent, alternate);
  }

  /**
   * VariableStatement
   *  : 'let' VariableDeclarationList ';'
   *  ;
   */
  private VariableStatement(): ASTNode {
    this.eat(TokenType.LET);
    const declarations = this.VariableDeclarationList();
    this.eat(TokenType.SEMICOLON);
    return ASTFactory.VariableStatement(declarations);
  }

  /**
   * VariableDeclarationList
   *  : VariableDeclaration
   *  | VariableDeclarationList ',' VariableDeclaration
   *  ;
   */
  private VariableDeclarationList(): ASTNode[] {
    const declarations: ASTNode[] = [];

    do {
      declarations.push(this.VariableDeclaration());
    } while (
      this.lookahead?.type === TokenType.COMMA &&
      this.eat(TokenType.COMMA)
    );

    return declarations;
  }

  /**
   * VariableDeclaration
   *  : Identifier OptVariableInitializer
   *  ;
   */
  private VariableDeclaration(): ASTNode {
    const id = this.Identifier();

    const init =
      this.lookahead?.type !== TokenType.SEMICOLON &&
      this.lookahead?.type !== TokenType.COMMA
        ? this.VariableInitializer()
        : null;

    return ASTFactory.VariableDeclaration(id, init);
  }

  /**
   * VariableInitializer
   *  : SIMPLE_ASSIGN AssignmentExpression
   *  ;
   */
  private VariableInitializer() {
    this.eat(TokenType.SIMPLE_ASSIGN);
    return this.AssignmentExpression();
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
   *  : AssignmentExpression
   *  ;
   */
  private Expression(): ASTNode {
    return this.AssignmentExpression();
  }

  /**
   * AssignmentExpression
   *  : RelationalExpression
   *  | LeftHandSideExpression AssignmentOperator AssignmentExpression
   *  ;
   */
  private AssignmentExpression(): ASTNode {
    const left = this.RelationalExpression();

    if (!this.isAssignmentOperator(this.lookahead?.type!)) {
      return left;
    }

    return ASTFactory.AssignmentExpression(
      this.AssignmentOperator().value,
      this.checkValidAssignmentTarget(left),
      this.AssignmentExpression()
    );
  }

  /**
   * LeftHandSideExpression
   *  : Identifier
   *  ;
   */
  private LeftHandSideExpression(): ASTNode {
    return this.Identifier();
  }

  /**
   * Identifier
   *  : IDENTIFIER
   *  ;
   */
  private Identifier() {
    const name = this.eat(TokenType.IDENTIFIER).value;
    return ASTFactory.Identifier(name);
  }

  private checkValidAssignmentTarget(node: ASTNode) {
    if (node.type === ASTNodeType.Identifier) {
      return node;
    }
    throw new SyntaxError("Invalid left-hand side in assignment expression");
  }

  private isAssignmentOperator(tokenType: TokenType) {
    return (
      tokenType === TokenType.SIMPLE_ASSIGN ||
      tokenType === TokenType.COMPLEX_ASSIGN
    );
  }

  /**
   * AssignmentOperator
   *  : SIMPLE_ASSIGN
   *  | COMPLEX_ASSIGN
   *  ;
   */
  private AssignmentOperator(): Token {
    if (this.lookahead?.type === TokenType.SIMPLE_ASSIGN) {
      return this.eat(TokenType.SIMPLE_ASSIGN);
    }
    return this.eat(TokenType.COMPLEX_ASSIGN);
  }

  /**
   * RelationalExpression
   *  : AdditiveExpression
   *  | RelationalExpression RELATIONAL_OPERATOR AdditiveExpression
   *  ;
   */
   private RelationalExpression(): ASTNode {
    return this.BinaryExpression(
      () => this.AdditiveExpression(),
      TokenType.RELATIONAL_OPERATOR
    );
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
   *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
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
   *  | LeftHandSideExpression
   *  ;
   */
  private PrimaryExpression(): ASTNode {
    if (this.isLiteral(this.lookahead?.type!)) {
      return this.Literal();
    }

    switch (this.lookahead?.type) {
      case TokenType.LEFT_PAREN:
        return this.ParenthesizedExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  private isLiteral(tokenType: TokenType) {
    return tokenType === TokenType.NUMBER || tokenType === TokenType.STRING;
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
