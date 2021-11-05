import { ASTNodeType } from "../ASTFactory";

describe("Do While tests", () => {
  it("should parse do while blocks", () => {
    const program = `
      do {
        x -= 1;
      } while (x > 10);
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.DoWhileStatement,
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
        },
      ],
    });
  });
});
