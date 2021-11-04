import { ASTNode } from "../ASTFactory";

describe("Literals tests", () => {
  it("should parse 2 separate expression statements", () => {
    const program = `
      "hello";
      42;
    `;

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
});
