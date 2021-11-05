import { ASTNodeType } from "../ASTFactory";

describe("Class tests", () => {
  it("should parse class declaration", () => {
    const program = `
      class Point {
        def constructor(x, y) {
          this.x = x;
          this.y = y;
        }
        def calc() {
          return this.x + this.y;
        }
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ClassDeclaration,
          id: {
            type: ASTNodeType.Identifier,
            name: "Point",
          },
          superClass: null,
          body: {
            type: ASTNodeType.BlockStatement,
            body: [
              {
                type: ASTNodeType.FunctionDeclaration,
                name: {
                  type: ASTNodeType.Identifier,
                  name: "constructor",
                },
                params: [
                  {
                    type: ASTNodeType.Identifier,
                    name: "x",
                  },
                  {
                    type: ASTNodeType.Identifier,
                    name: "y",
                  },
                ],
                body: {
                  type: ASTNodeType.BlockStatement,
                  body: [
                    {
                      type: ASTNodeType.ExpressionStatement,
                      expression: {
                        type: ASTNodeType.AssignmentExpression,
                        left: {
                          type: ASTNodeType.MemberExpression,
                          computed: false,
                          object: {
                            type: ASTNodeType.ThisExpression,
                          },
                          property: {
                            type: ASTNodeType.Identifier,
                            name: "x",
                          },
                        },
                        operator: "=",
                        right: {
                          type: ASTNodeType.Identifier,
                          name: "x",
                        },
                      },
                    },
                    {
                      type: ASTNodeType.ExpressionStatement,
                      expression: {
                        type: ASTNodeType.AssignmentExpression,
                        left: {
                          type: ASTNodeType.MemberExpression,
                          computed: false,
                          object: {
                            type: ASTNodeType.ThisExpression,
                          },
                          property: {
                            type: ASTNodeType.Identifier,
                            name: "y",
                          },
                        },
                        operator: "=",
                        right: {
                          type: ASTNodeType.Identifier,
                          name: "y",
                        },
                      },
                    },
                  ],
                },
              },
              {
                type: ASTNodeType.FunctionDeclaration,
                name: {
                  type: ASTNodeType.Identifier,
                  name: "calc",
                },
                params: [],
                body: {
                  type: ASTNodeType.BlockStatement,
                  body: [
                    {
                      type: "ReturnStatement",
                      argument: {
                        type: "BinaryExpression",
                        operator: "+",
                        left: {
                          type: ASTNodeType.MemberExpression,
                          computed: false,
                          object: {
                            type: ASTNodeType.ThisExpression,
                          },
                          property: {
                            type: ASTNodeType.Identifier,
                            name: "x",
                          },
                        },
                        right: {
                          type: ASTNodeType.MemberExpression,
                          computed: false,
                          object: {
                            type: ASTNodeType.ThisExpression,
                          },
                          property: {
                            type: ASTNodeType.Identifier,
                            name: "y",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should parse class extension", () => {
    const program = `
      class Point3D extends Point {
        def constructor(x, y, z) {
          super(x, y);
          this.z = z;
        }
        def calc() {
          return super() + this.z;
        }
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ClassDeclaration,
          id: {
            type: ASTNodeType.Identifier,
            name: "Point3D",
          },
          superClass: {
            type: ASTNodeType.Identifier,
            name: "Point",
          },
          body: {
            type: ASTNodeType.BlockStatement,
            body: [
              {
                type: ASTNodeType.FunctionDeclaration,
                name: {
                  type: ASTNodeType.Identifier,
                  name: "constructor",
                },
                params: [
                  {
                    type: ASTNodeType.Identifier,
                    name: "x",
                  },
                  {
                    type: ASTNodeType.Identifier,
                    name: "y",
                  },
                  {
                    type: ASTNodeType.Identifier,
                    name: "z",
                  },
                ],
                body: {
                  type: ASTNodeType.BlockStatement,
                  body: [
                    {
                      type: ASTNodeType.ExpressionStatement,
                      expression: {
                        type: "CallExpression",
                        callee: {
                          type: ASTNodeType.Super,
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
                    {
                      type: ASTNodeType.ExpressionStatement,
                      expression: {
                        type: ASTNodeType.AssignmentExpression,
                        left: {
                          type: ASTNodeType.MemberExpression,
                          computed: false,
                          object: {
                            type: ASTNodeType.ThisExpression,
                          },
                          property: {
                            type: ASTNodeType.Identifier,
                            name: "z",
                          },
                        },
                        operator: "=",
                        right: {
                          type: ASTNodeType.Identifier,
                          name: "z",
                        },
                      },
                    },
                  ],
                },
              },
              {
                type: ASTNodeType.FunctionDeclaration,
                name: {
                  type: ASTNodeType.Identifier,
                  name: "calc",
                },
                params: [],
                body: {
                  type: ASTNodeType.BlockStatement,
                  body: [
                    {
                      type: "ReturnStatement",
                      argument: {
                        type: "BinaryExpression",
                        operator: "+",
                        left: {
                          type: "CallExpression",
                          callee: {
                            type: "Super",
                          },
                          arguments: [],
                        },
                        right: {
                          type: ASTNodeType.MemberExpression,
                          computed: false,
                          object: {
                            type: ASTNodeType.ThisExpression,
                          },
                          property: {
                            type: ASTNodeType.Identifier,
                            name: "z",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should parse new expression", () => {
    const program = `
       new Point3D(10, 20, 30);
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.ExpressionStatement,
          expression: {
            type: ASTNodeType.NewExpression,
            callee: {
              type: ASTNodeType.Identifier,
              name: "Point3D",
            },
            arguments: [
              {
                type: "NumericLiteral",
                value: 10,
              },
              {
                type: "NumericLiteral",
                value: 20,
              },
              {
                type: "NumericLiteral",
                value: 30,
              },
            ],
          },
        },
      ],
    });
  });
});
