import { TokenType } from "./TokenType";

interface TokenNode {
  type: TokenType;
  value: any;
}

export const TokenFactory: {
  [key in keyof typeof TokenType]: (value: any) => TokenNode;
} = {
  NumericLiteral: (value: number) => ({
    type: TokenType.NumericLiteral,
    value,
  }),
};
