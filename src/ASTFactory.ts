export enum ASTNodeType {
  Program = "Program",
  ExpressionStatement = "ExpressionStatement",
  BlockStatement = "BlockStatement",
  EmptyStatement = "EmptyStatement",
  BinaryExpression = "BinaryExpression",
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
  NumericLiteral: (value: number) => ({
    type: ASTNodeType.NumericLiteral,
    value,
  }),
  StringLiteral: (value: string) => ({
    type: ASTNodeType.StringLiteral,
    value,
  }),
};
