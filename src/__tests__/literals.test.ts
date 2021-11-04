import { ASTNodeType } from "../ASTFactory";

describe("Literals tests", () => {
  it("should parse 42 as a NumericLiteral", () => {
    const program = `42;`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.NumericLiteral,
            value: 42,
          },
        },
      ],
    });
  });

  it('should parse "hello" as a StringLiteral', () => {
    const program = `"hello";`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.StringLiteral,
            value: "hello",
          },
        },
      ],
    });
  });

  it("should correctly parse 'hello'; as a StringLiteral", () => {
    const program = `'hello';`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.StringLiteral,
            value: "hello",
          },
        },
      ],
    });
  });
});
