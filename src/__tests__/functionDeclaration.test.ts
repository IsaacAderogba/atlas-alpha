import { ASTNodeType } from "../ASTFactory";

describe("Function declaration tests", () => {
  it("should parse function declarations", () => {
    const program = `
      def square(x) {
        return x * x;
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.FunctionDeclaration,
          name: {
            type: ASTNodeType.Identifier,
            name: "square",
          },
          params: [
            {
              type: ASTNodeType.Identifier,
              name: "x",
            },
          ],
          body: {
            type: ASTNodeType.BlockStatement,
            body: [
              {
                type: ASTNodeType.ReturnStatement,
                argument: {
                  type: ASTNodeType.BinaryExpression,
                  operator: "*",
                  left: {
                    type: ASTNodeType.Identifier,
                    name: "x",
                  },
                  right: {
                    type: ASTNodeType.Identifier,
                    name: "x",
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should parse empty function declarations", () => {
    const program = `
      def empty() {
        return;
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.FunctionDeclaration,
          name: {
            type: ASTNodeType.Identifier,
            name: "empty",
          },
          params: [],
          body: {
            type: ASTNodeType.BlockStatement,
            body: [
              {
                type: ASTNodeType.ReturnStatement,
                argument: null,
              },
            ],
          },
        },
      ],
    });
  });
});
