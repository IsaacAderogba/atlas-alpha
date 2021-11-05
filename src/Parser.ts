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
   *  | IterationStatement
   *  | FunctionDeclaration
   *  | ReturnStatement
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
      case TokenType.DEF:
        return this.FunctionDeclaration();
      case TokenType.RETURN:
        return this.ReturnStatement();
      case TokenType.DO:
      case TokenType.WHILE:
      case TokenType.FOR:
        return this.IterationStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * FunctionDeclaration
   *  : 'def' Identifier '(' OptFormalParameterList ')' BlockStatement
   *  ;
   */
  private FunctionDeclaration() {
    this.eat(TokenType.DEF);
    const name = this.Identifier();
    this.eat(TokenType.LEFT_PAREN);

    const params =
      this.lookahead?.type !== TokenType.RIGHT_PAREN
        ? this.FormalParameterList()
        : [];

    this.eat(TokenType.RIGHT_PAREN);
    const body = this.BlockStatement();

    return ASTFactory.FunctionDeclaration(name, params, body);
  }

  /**
   * FormalParameterList
   *  : Identifier
   *  | FormalParameterList ',' Identifier
   *  ;
   */
  private FormalParameterList() {
    const params: ASTNode[] = [];

    do {
      params.push(this.Identifier());
    } while (
      this.lookahead?.type === TokenType.COMMA &&
      this.eat(TokenType.COMMA)
    );

    return params;
  }

  /**
   * ReturnStatement
   *  : 'return' OptExpression
   *  ;
   */
  private ReturnStatement() {
    this.eat(TokenType.RETURN);
    const argument =
      this.lookahead?.type !== TokenType.SEMICOLON ? this.Expression() : null;
    this.eat(TokenType.SEMICOLON);

    return ASTFactory.ReturnStatement(argument);
  }

  /**
   * IterationStatement
   *  : WhileStatement
   *  | DoWhileStatement
   *  | ForStatement
   *  ;
   */
  private IterationStatement(): ASTNode {
    switch (this.lookahead?.type) {
      case TokenType.DO:
        return this.DoWhileStatement();
      case TokenType.WHILE:
        return this.WhileStatement();
      case TokenType.FOR:
        return this.ForStatement();
    }
    throw new SyntaxError(
      `Unexpected type "${this.lookahead?.type}", expected Iterator`
    );
  }

  /**
   * DoWhileStatement
   *  : 'do' Statement 'while' '(' Expression ')' ';'
   *  ;
   */
  private DoWhileStatement(): ASTNode {
    this.eat(TokenType.DO);

    const body = this.Statement();

    this.eat(TokenType.WHILE);

    this.eat(TokenType.LEFT_PAREN);
    const test = this.Expression();
    this.eat(TokenType.RIGHT_PAREN);

    this.eat(TokenType.SEMICOLON);
    return ASTFactory.DoWhileStatement(body, test);
  }

  /**
   * WhileStatement
   *  : 'while' '(' Expression ')' Statement
   *  ;
   */
  private WhileStatement(): ASTNode {
    this.eat(TokenType.WHILE);

    this.eat(TokenType.LEFT_PAREN);
    const test = this.Expression();
    this.eat(TokenType.RIGHT_PAREN);

    const body = this.Statement();

    return ASTFactory.WhileStatement(test, body);
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
   * ForStatement
   *  : 'for' '(' OptForStatementInit ';' OptExpression ';' OptExpression ')' Statement
   *  ;
   */
  private ForStatement(): ASTNode {
    this.eat(TokenType.FOR);
    this.eat(TokenType.LEFT_PAREN);

    const init =
      this.lookahead?.type !== TokenType.SEMICOLON
        ? this.ForStatementInit()
        : null;
    this.eat(TokenType.SEMICOLON);

    const test =
      this.lookahead?.type !== TokenType.SEMICOLON ? this.Expression() : null;
    this.eat(TokenType.SEMICOLON);

    const update =
      this.lookahead?.type !== TokenType.RIGHT_PAREN ? this.Expression() : null;
    this.eat(TokenType.RIGHT_PAREN);

    const body = this.Statement();

    return ASTFactory.ForStatement(init, test, update, body);
  }

  /**
   * ForStatementInit
   *  : VariableStatementInit
   *  | Expression
   *  ;
   */
  private ForStatementInit(): ASTNode {
    if (this.lookahead?.type === TokenType.LET) {
      return this.VariableStatementInit();
    }
    return this.Expression();
  }

  /**
   * VariableStatementInit
   *  : 'let' VariableDeclarationList
   *  ;
   */
  private VariableStatementInit() {
    this.eat(TokenType.LET);
    const declarations = this.VariableDeclarationList();
    return ASTFactory.VariableStatement(declarations);
  }

  /**
   * VariableStatement
   *  : 'let' VariableStatementInit ';'
   *  ;
   */
  private VariableStatement(): ASTNode {
    const variableStatement = this.VariableStatementInit();
    this.eat(TokenType.SEMICOLON);
    return variableStatement;
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
   *  : LogicalORExpression
   *  | LeftHandSideExpression AssignmentOperator AssignmentExpression
   *  ;
   */
  private AssignmentExpression(): ASTNode {
    const left = this.LogicalORExpression();

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
   * Identifier
   *  : IDENTIFIER
   *  ;
   */
  private Identifier() {
    const name = this.eat(TokenType.IDENTIFIER).value;
    return ASTFactory.Identifier(name);
  }

  private checkValidAssignmentTarget(node: ASTNode) {
    if (node.type === ASTNodeType.Identifier || node.type === ASTNodeType.MemberExpression) {
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
   * LogicalORExpression
   *  : EqualityExpression LOGICAL_OR LogicalORExpression
   *  | EqualityExpression
   *  ;
   */
  private LogicalORExpression() {
    return this.LogicalExpression(
      () => this.LogicalANDExpression(),
      TokenType.LOGICAL_OR
    );
  }

  /**
   * LogicalANDExpression
   *  : EqualityExpression LOGICAL_AND LogicalANDExpression
   *  | EqualityExpression
   *  ;
   */
  private LogicalANDExpression() {
    return this.LogicalExpression(
      () => this.EqualityExpression(),
      TokenType.LOGICAL_AND
    );
  }

  /**
   * EqualityExpression
   *  : RelationalExpression
   *  | EqualityExpression RELATIONAL_OPERATOR RelationalExpression
   *  ;
   */
  private EqualityExpression(): ASTNode {
    return this.BinaryExpression(
      () => this.RelationalExpression(),
      TokenType.EQUALITY_OPERATOR
    );
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
   *  : UnaryExpression
   *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR UnaryExpression
   *  ;
   */
  private MultiplicativeExpression(): ASTNode {
    return this.BinaryExpression(
      () => this.UnaryExpression(),
      TokenType.MULTIPLICATIVE_OPERATOR
    );
  }

  private LogicalExpression(callback: () => ASTNode, operatorToken: TokenType) {
    let left = callback();

    while (this.lookahead?.type === operatorToken) {
      const operator = this.eat(operatorToken).value;
      const right = callback();

      left = ASTFactory.LogicalExpression(operator, left, right);
    }

    return left;
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
   * UnaryExpression
   *  : LeftHandSideExpression
   *  | ADDITIVE_OPERATOR UnaryExpression
   *  | LOGICAL_NOT UnaryExpression
   *  ;
   */
  private UnaryExpression(): ASTNode {
    let operator: Token["value"] | null = null;

    switch (this.lookahead?.type) {
      case TokenType.ADDITIVE_OPERATOR:
        operator = this.eat(TokenType.ADDITIVE_OPERATOR).value;
        break;
      case TokenType.LOGICAL_NOT:
        operator = this.eat(TokenType.LOGICAL_NOT).value;
        break;
    }

    if (operator != null) {
      return ASTFactory.UnaryExpression(operator, this.UnaryExpression());
    }

    return this.LeftHandSideExpression();
  }

  /**
   * LeftHandSideExpression
   *  : MemberExpression
   *  ;
   */
  private LeftHandSideExpression(): ASTNode {
    return this.MemberExpression();
  }

  /**
   * MemberExpression
   *  : PrimaryExpression
   *  | MemberExpression '.' Identifier
   *  | MemberExpression '[' Expression ']'
   */
  private MemberExpression(): ASTNode {
    let object = this.PrimaryExpression();

    while (
      this.lookahead?.type === TokenType.DOT ||
      this.lookahead?.type === TokenType.LEFT_BRACKET
    ) {
      if (this.lookahead.type === TokenType.DOT) {
        this.eat(TokenType.DOT);
        const property = this.Identifier();

        object = ASTFactory.MemberExpression(false, object, property);
      }

      if (this.lookahead.type === TokenType.LEFT_BRACKET) {
        this.eat(TokenType.LEFT_BRACKET);
        const property = this.Expression();
        this.eat(TokenType.RIGHT_BRACKET);

        object = ASTFactory.MemberExpression(true, object, property);
      }
    }

    return object;
  }

  /**
   * PrimaryExpression
   *  : Literal
   *  | ParenthesizedExpression
   *  | Identifier
   *  ;
   */
  private PrimaryExpression(): ASTNode {
    if (this.isLiteral(this.lookahead?.type!)) {
      return this.Literal();
    }

    switch (this.lookahead?.type) {
      case TokenType.LEFT_PAREN:
        return this.ParenthesizedExpression();
      case TokenType.IDENTIFIER:
        return this.Identifier();
      default:
        return this.LeftHandSideExpression();
    }
  }

  private isLiteral(tokenType: TokenType) {
    return [
      TokenType.NUMBER,
      TokenType.STRING,
      TokenType.TRUE,
      TokenType.FALSE,
      TokenType.NULL,
    ].includes(tokenType);
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
   *  | BooleanLiteral
   *  | NullLiteral
   *  ;
   */
  private Literal(): ASTNode {
    switch (this.lookahead?.type) {
      case TokenType.NUMBER:
        return this.NumericLiteral();
      case TokenType.STRING:
        return this.StringLiteral();
      case TokenType.TRUE:
        return this.BooleanLiteral(true);
      case TokenType.FALSE:
        return this.BooleanLiteral(false);
      case TokenType.NULL:
        return this.NullLiteral();
      default:
        throw new SyntaxError(`Literal: unexpected literal production`);
    }
  }

  /**
   * BooleanLiteral
   *  : 'true'
   *  | 'false'
   *  ;
   */
  private BooleanLiteral(value: boolean): ASTNode {
    this.eat(value ? TokenType.TRUE : TokenType.FALSE);
    return ASTFactory.BooleanLiteral(value);
  }

  /**
   * NullLiteral
   *  : 'true'
   *  | 'false'
   *  ;
   */
  private NullLiteral(): ASTNode {
    this.eat(TokenType.NULL);
    return ASTFactory.NullLiteral();
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
