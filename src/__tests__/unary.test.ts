import { ASTNodeType } from "../ASTFactory";

describe("Unary tests", () => {
  it("should parse unary - expression", () => {
    const program = `
      -x;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.UnaryExpression,
            operator: "-",
            argument: {
              type: ASTNodeType.Identifier,
              name: "x",
            },
          },
        },
      ],
    });
  });

  it("should parse unary ! expression", () => {
    const program = `
      !x;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.UnaryExpression,
            operator: "!",
            argument: {
              type: ASTNodeType.Identifier,
              name: "x",
            },
          },
        },
      ],
    });
  });
});
