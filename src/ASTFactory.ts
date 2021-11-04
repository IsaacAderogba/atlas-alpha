export enum ASTNodeType {
  Program = "Program",
  ExpressionStatement = "ExpressionStatement",
  BlockStatement = "BlockStatement",
  EmptyStatement = "EmptyStatement",
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
  [key in keyof typeof ASTNodeType]: (value?: any) => ASTNode;
} = {
  Program: (body: any) => ({
    type: ASTNodeType.Program,
    body,
  }),
  NumericLiteral: (value: number) => ({
    type: ASTNodeType.NumericLiteral,
    value,
  }),
  StringLiteral: (value: string) => ({
    type: ASTNodeType.StringLiteral,
    value,
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
};
