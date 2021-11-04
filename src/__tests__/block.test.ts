import { ASTNode } from "../ASTFactory";

describe("Block tests", () => {
  it("should parse a block statement with 2 expression statements", () => {
    const program = `
      {
        "hello";
        42;
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNode.Program,
      body: [
        {
          type: ASTNode.BlockStatement,
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
        },
      ],
    });
  });

  it("should parse an empty block statement", () => {
    const program = `
      {
       
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNode.Program,
      body: [
        {
          type: ASTNode.BlockStatement,
          body: [],
        },
      ],
    });
  });

  it("should parse nested block statements", () => {
    const program = `
      {
        {
          "hello";
          42;
        }
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNode.Program,
      body: [
        {
          type: ASTNode.BlockStatement,
          body: [
            {
              type: ASTNode.BlockStatement,
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
            },
          ],
        },
      ],
    });
  });
});
