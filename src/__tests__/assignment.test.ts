import { ASTNodeType } from "../ASTFactory";

describe("Assignment tests", () => {
  it("should parse simple assignment", () => {
    const program = `x = 42;`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.AssignmentExpression,
            operator: "=",
            left: {
              type: ASTNodeType.Identifier,
              name: "x",
            },
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 42,
            },
          },
        },
      ],
    });
  });

  it("should parse chained assignment", () => {
    const program = `x = y = 42;`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.AssignmentExpression,
            operator: "=",
            left: {
              type: ASTNodeType.Identifier,
              name: "x",
            },
            right: {
              type: ASTNodeType.AssignmentExpression,
              operator: "=",
              left: {
                type: ASTNodeType.Identifier,
                name: "y",
              },
              right: {
                type: ASTNodeType.NumericLiteral,
                value: 42,
              },
            },
          },
        },
      ],
    });
  });
});
