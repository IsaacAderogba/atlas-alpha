import { ASTNode } from "../ASTFactory";

describe("Literals tests", () => {
  it("should parse 42 as a NumericLiteral", () => {
    const program = `42;`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNode.Program,
      body: [
        {
          type: ASTNode.ExpressionStatement,
          expression: {
            type: ASTNode.NumericLiteral,
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
      type: ASTNode.Program,
      body: [
        {
          type: ASTNode.ExpressionStatement,
          expression: {
            type: ASTNode.StringLiteral,
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
      type: ASTNode.Program,
      body: [
        {
          type: ASTNode.ExpressionStatement,
          expression: {
            type: ASTNode.StringLiteral,
            value: "hello",
          },
        },
      ],
    });
  });
});
