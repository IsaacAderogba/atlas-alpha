import { ASTNodeType } from "../ASTFactory";

describe("For tests", () => {
  it("should parse for blocks", () => {
    const program = `
      for (let i = 0; i < 10; i += 1) {
        x += i;
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ForStatement,
          init: {
            type: ASTNodeType.VariableStatement,
            declarations: [
              {
                type: ASTNodeType.VariableDeclaration,
                id: {
                  type: ASTNodeType.Identifier,
                  name: "i",
                },
                init: {
                  type: ASTNodeType.NumericLiteral,
                  value: 0,
                },
              },
            ],
          },
          test: {
            type: ASTNodeType.BinaryExpression,
            operator: "<",
            left: {
              type: ASTNodeType.Identifier,
              name: "i",
            },
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 10,
            },
          },
          update: {
            type: ASTNodeType.AssignmentExpression,
            left: {
              type: ASTNodeType.Identifier,
              name: "i",
            },
            operator: "+=",
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 1,
            },
          },
          body: {
            type: ASTNodeType.BlockStatement,
            body: [
              {
                type: ASTNodeType.ExpressionStatement,
                expression: {
                  type: ASTNodeType.AssignmentExpression,
                  left: {
                    type: ASTNodeType.Identifier,
                    name: "x",
                  },
                  operator: "+=",
                  right: {
                    type: ASTNodeType.Identifier,
                    name: "i",
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should parse empty for blocks", () => {
    const program = `
      for (;;) {

      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ForStatement,
          init: null,
          test: null,
          update: null,
          body: {
            type: ASTNodeType.BlockStatement,
            body: [],
          },
        },
      ],
    });
  });
});
