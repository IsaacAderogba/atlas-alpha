import { ASTNodeType } from "../ASTFactory";

describe("Statement List tests", () => {
  it("should parse 2 separate expression statements", () => {
    const program = `
      "hello";
      42;
    `;

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
});
