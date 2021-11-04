import { TokenType } from "./TokenType";

export const TokenFactory: {
  [key in keyof typeof TokenType]: (value: any) => {
    type: TokenType;
  };
} = {
  Program: (body: any) => ({
    type: TokenType.Program,
    body,
  }),
  NumericLiteral: (value: number) => ({
    type: TokenType.NumericLiteral,
    value,
  }),
};
