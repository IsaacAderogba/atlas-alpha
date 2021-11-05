import { ASTNodeType } from "../ASTFactory";

describe("Variable tests", () => {
  it("should parse relational statements", () => {
    const program = `
      x > 0;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.BinaryExpression,
            operator: ">",
            left: {
              type: ASTNodeType.Identifier,
              name: "x",
            },
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 0,
            },
          },
        },
      ],
    });
  });
});
