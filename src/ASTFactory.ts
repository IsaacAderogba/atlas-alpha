export enum ASTNode {
  Program = "Program",
  NumericLiteral = "NumericLiteral",
  StringLiteral = "StringLiteral",
}

export const ASTFactory: {
  [key in keyof typeof ASTNode]: (value: any) => {
    type: ASTNode;
  };
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
};
