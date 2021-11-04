export enum ASTNodeType {
  Program = "Program",
  ExpressionStatement = "ExpressionStatement",
  BlockStatement = "BlockStatement",
  EmptyStatement = "EmptyStatement",
  BinaryExpression = "BinaryExpression",
  AssignmentExpression = "AssignmentExpression",
  VariableStatement = "VariableStatement",
  VariableDeclaration = "VariableDeclaration",
  Identifier = "Identifier",
  NumericLiteral = "NumericLiteral",
  StringLiteral = "StringLiteral",
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
  NumericLiteral: (value) => ({
    type: ASTNodeType.NumericLiteral,
    value,
  }),
  StringLiteral: (value) => ({
    type: ASTNodeType.StringLiteral,
    value,
  }),
  Identifier: (name) => ({
    type: ASTNodeType.Identifier,
    name,
  }),
};
