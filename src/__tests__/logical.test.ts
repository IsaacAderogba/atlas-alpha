import { ASTNodeType } from "../ASTFactory";

describe("Variable tests", () => {
  it("should parse logical and", () => {
    const program = `
      x > 0 && y < 1;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.LogicalExpression,
            operator: "&&",
            left: {
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
            right: {
              type: ASTNodeType.BinaryExpression,
              operator: "<",
              left: {
                type: ASTNodeType.Identifier,
                name: "y",
              },
              right: {
                type: ASTNodeType.NumericLiteral,
                value: 1,
              },
            },
          },
        },
      ],
    });
  });

  it("should parse the equality == blocks", () => {
    const program = `
      x >= 0 != false;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.BinaryExpression,
            operator: "!=",
            left: {
              type: ASTNodeType.BinaryExpression,
              operator: ">=",
              left: {
                type: ASTNodeType.Identifier,
                name: "x",
              },
              right: {
                type: ASTNodeType.NumericLiteral,
                value: 0,
              },
            },
            right: {
              type: ASTNodeType.BooleanLiteral,
              value: false,
            },
          },
        },
      ],
    });
  });
});
