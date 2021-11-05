import { ASTNodeType } from "../ASTFactory";

describe("Variable tests", () => {
  it("should parse if else blocks", () => {
    const program = `
      if (x) {
        x = 1;
      } else {
        x = 2;
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.IfStatement,
          test: {
            type: ASTNodeType.Identifier,
            name: "x",
          },
          consequent: {
            type: ASTNodeType.BlockStatement,
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
                    value: 1,
                  },
                },
              },
            ],
          },
          alternate: {
            type: ASTNodeType.BlockStatement,
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
                    value: 2,
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should parse if blocks", () => {
    const program = `
      if (x) {
        x = 1;
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.IfStatement,
          test: {
            type: ASTNodeType.Identifier,
            name: "x",
          },
          consequent: {
            type: ASTNodeType.BlockStatement,
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
                    value: 1,
                  },
                },
              },
            ],
          },
          alternate: null,
        },
      ],
    });
  });
});
