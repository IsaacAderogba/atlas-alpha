import { ASTNodeType } from "../ASTFactory";

describe("Member tests", () => {
  it("should parse variable access using dot notation", () => {
    const program = `
      x.y;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.MemberExpression,
            computed: false,
            object: {
              type: ASTNodeType.Identifier,
              name: "x",
            },
            property: {
              type: ASTNodeType.Identifier,
              name: "y",
            },
          },
        },
      ],
    });
  });

  it("should parse assignment of values using dot notation", () => {
    const program = `
      x.y = 1;
    `;

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
              type: ASTNodeType.MemberExpression,
              computed: false,
              object: {
                type: ASTNodeType.Identifier,
                name: "x",
              },
              property: {
                type: ASTNodeType.Identifier,
                name: "y",
              },
            },
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 1,
            },
          },
        },
      ],
    });
  });

  it("should parse assignment of values using bracket notation", () => {
    const program = `
      x[0] = 1;
    `;

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
              type: ASTNodeType.MemberExpression,
              computed: true,
              object: {
                type: ASTNodeType.Identifier,
                name: "x",
              },
              property: {
                type: ASTNodeType.NumericLiteral,
                value: 0,
              },
            },
            right: {
              type: ASTNodeType.NumericLiteral,
              value: 1,
            },
          },
        },
      ],
    });
  });

  it("should parse chained access", () => {
    const program = `
      a.b.c['d'];
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.MemberExpression,
            computed: true,
            object: {
              type: ASTNodeType.MemberExpression,
              computed: false,
              object: {
                type: ASTNodeType.MemberExpression,
                computed: false,
                object: {
                  type: ASTNodeType.Identifier,
                  name: "a",
                },
                property: {
                  type: ASTNodeType.Identifier,
                  name: "b",
                },
              },
              property: {
                type: ASTNodeType.Identifier,
                name: "c",
              },
            },
            property: {
              type: ASTNodeType.StringLiteral,
              value: "d",
            },
          },
        },
      ],
    });
  });
});
