import { ASTNodeType } from "../ASTFactory";

describe("While tests", () => {
  it("should parse while blocks", () => {
    const program = `
      while (x > 10) {
        x -= 1;
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.WhileStatement,
          test: {
            type: ASTNodeType.BinaryExpression,
            operator: ">",
            left: {
              type: ASTNodeType.Identifier,
              name: "x",
            },
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 10,
            },
          },
          body: {
            type: ASTNodeType.BlockStatement,
            body: [
              {
                type: ASTNodeType.ExpressionStatement,
                expression: {
                  type: ASTNodeType.AssignmentExpression,
                  operator: "-=",
                  left: {
                    type: ASTNodeType.Identifier,
                    name: "x",
                  },
                  right: {
                    type: ASTNodeType.NumericLiteral,
                    value: 1,
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should parse equality blocks", () => {
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
