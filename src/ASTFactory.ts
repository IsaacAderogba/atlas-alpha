export enum ASTNodeType {
  Program = "Program",
  ExpressionStatement = "ExpressionStatement",
  BlockStatement = "BlockStatement",
  EmptyStatement = "EmptyStatement",
  BinaryExpression = "BinaryExpression",
  LogicalExpression = "LogicalExpression",
  UnaryExpression = "UnaryExpression",
  AssignmentExpression = "AssignmentExpression",
  VariableStatement = "VariableStatement",
  VariableDeclaration = "VariableDeclaration",
  IfStatement = "IfStatement",
  Identifier = "Identifier",
  NumericLiteral = "NumericLiteral",
  StringLiteral = "StringLiteral",
  BooleanLiteral = "BooleanLiteral",
  NullLiteral = "NullLiteral",
}

export type ASTNode = {
  type: ASTNodeType;
  value?: any;
  body?: any;
  expression?: any;
};

export const ASTFactory: {
  [key in keyof typeof ASTNodeType]: (...value: any[]) => ASTNode;
} = {
  Program: (body: any) => ({
    type: ASTNodeType.Program,
    body,
  }),
  ExpressionStatement: (expression: string) => ({
    type: ASTNodeType.ExpressionStatement,
    expression,
  }),
  BlockStatement: (body: string) => ({
    type: ASTNodeType.BlockStatement,
    body,
  }),
  EmptyStatement: () => ({
    type: ASTNodeType.EmptyStatement,
  }),
  BinaryExpression: (operator, left, right) => ({
    type: ASTNodeType.BinaryExpression,
    operator,
    left,
    right,
  }),
  LogicalExpression: (operator, left, right) => ({
    type: ASTNodeType.LogicalExpression,
    operator,
    left,
    right,
  }),
  UnaryExpression: (operator, argument) => ({
    type: ASTNodeType.UnaryExpression,
    operator,
    argument,
  }),
  AssignmentExpression: (operator, left, right) => ({
    type: ASTNodeType.AssignmentExpression,
    operator,
    left,
    right,
  }),
  VariableStatement: (declarations) => ({
    type: ASTNodeType.VariableStatement,
    declarations,
  }),
  VariableDeclaration: (id, init) => ({
    type: ASTNodeType.VariableDeclaration,
    id,
    init,
  }),
  IfStatement: (test, consequent, alternate) => ({
    type: ASTNodeType.IfStatement,
    test,
    consequent,
    alternate,
  }),
  NumericLiteral: (value) => ({
    type: ASTNodeType.NumericLiteral,
    value,
  }),
  StringLiteral: (value) => ({
    type: ASTNodeType.StringLiteral,
    value,
  }),
  BooleanLiteral: (value) => ({
    type: ASTNodeType.BooleanLiteral,
    value,
  }),
  NullLiteral: () => ({
    type: ASTNodeType.NullLiteral,
    value: null,
  }),
  Identifier: (name) => ({
    type: ASTNodeType.Identifier,
    name,
  }),
};
