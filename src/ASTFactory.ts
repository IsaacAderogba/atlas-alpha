export enum ASTNode {
  Program = "Program",
  ExpressionStatement = "ExpressionStatement",
  BlockStatement = "BlockStatement",
  EmptyStatement = "EmptyStatement",
  NumericLiteral = "NumericLiteral",
  StringLiteral = "StringLiteral",
}

export type ASTNodeType = {
  type: ASTNode;
  value?: any;
  body?: any;
  expression?: any;
};

export const ASTFactory: {
  [key in keyof typeof ASTNode]: (value?: any) => ASTNodeType;
} = {
  Program: (body: any) => ({
    type: ASTNode.Program,
    body,
  }),
  NumericLiteral: (value: number) => ({
    type: ASTNode.NumericLiteral,
    value,
  }),
  StringLiteral: (value: string) => ({
    type: ASTNode.StringLiteral,
    value,
  }),
  ExpressionStatement: (expression: string) => ({
    type: ASTNode.ExpressionStatement,
    expression,
  }),
  BlockStatement: (body: string) => ({
    type: ASTNode.BlockStatement,
    body,
  }),
  EmptyStatement: () => ({
    type: ASTNode.EmptyStatement,
  }),
};
