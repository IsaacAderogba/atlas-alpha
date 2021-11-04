import { ASTNodeType } from "../ASTFactory";

describe("Math tests", () => {
  it("should parse addition expression", () => {
    const program = `
      2+2;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.BinaryExpression,
            operator: "+",
            left: {
              type: ASTNodeType.NumericLiteral,
              value: 2,
            },
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 2,
            },
          },
        },
      ],
    });
  });

  it("should parse operation expressions according to the order of precedence", () => {
    const program = `
      2 + 2 * 2;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.BinaryExpression,
            operator: "+",
            left: {
              type: ASTNodeType.NumericLiteral,
              value: 2,
            },
            right: {
              type: ASTNodeType.BinaryExpression,
              operator: "*",
              left: {
                type: ASTNodeType.NumericLiteral,
                value: 2,
              },
              right: {
                type: ASTNodeType.NumericLiteral,
                value: 2,
              },
            },
          },
        },
      ],
    });
  });

  it("should parse operation expressions according to the bracketed order of precedence", () => {
    const program = `
      (2 + 2) * 2;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.BinaryExpression,
            operator: "*",
            left: {
              type: ASTNodeType.BinaryExpression,
              operator: "+",
              left: {
                type: ASTNodeType.NumericLiteral,
                value: 2,
              },
              right: {
                type: ASTNodeType.NumericLiteral,
                value: 2,
              },
            },
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 2,
            },
          },
        },
      ],
    });
  });
});
