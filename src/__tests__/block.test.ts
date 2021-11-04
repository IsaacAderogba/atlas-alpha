import { ASTNodeType } from "../ASTFactory";

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
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.BlockStatement,
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
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.BlockStatement,
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
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.BlockStatement,
          body: [
            {
              type: ASTNodeType.BlockStatement,
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
            },
          ],
        },
      ],
    });
  });
});
