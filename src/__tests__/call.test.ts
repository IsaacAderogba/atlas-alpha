import { ASTNodeType } from "../ASTFactory";

describe("Call tests", () => {
  it("should parse function invocations", () => {
    const program = `
      foo(x);
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.CallExpression,
            callee: {
              type: ASTNodeType.Identifier,
              name: "foo",
            },
            arguments: [
              {
                type: ASTNodeType.Identifier,
                name: "x",
              },
            ],
          },
        },
      ],
    });
  });

  it("should parse function invocations in sequence", () => {
    const program = `
      foo(x)();
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.CallExpression,
            callee: {
              type: ASTNodeType.CallExpression,
              callee: {
                type: ASTNodeType.Identifier,
                name: "foo",
              },
              arguments: [
                {
                  type: ASTNodeType.Identifier,
                  name: "x",
                },
              ],
            },
            arguments: [],
          },
        },
      ],
    });
  });

  it("should parse function invocations after not notation access", () => {
    const program = `
      console.log(x, y);
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.CallExpression,
            callee: {
              type: ASTNodeType.MemberExpression,
              computed: false,
              object: {
                type: ASTNodeType.Identifier,
                name: "console",
              },
              property: {
                type: ASTNodeType.Identifier,
                name: "log",
              },
            },
            arguments: [
              {
                type: ASTNodeType.Identifier,
                name: "x",
              },
              {
                type: ASTNodeType.Identifier,
                name: "y",
              },
            ],
          },
        },
      ],
    });
  });
});
