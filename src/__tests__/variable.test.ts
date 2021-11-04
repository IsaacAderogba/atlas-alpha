import { ASTNodeType } from "../ASTFactory";

describe("Variable tests", () => {
  it("should parse simple variable declaration with initializer", () => {
    const program = `let x = 42;`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.VariableStatement,
          declarations: [
            {
              type: ASTNodeType.VariableDeclaration,
              id: {
                type: ASTNodeType.Identifier,
                name: "x",
              },
              init: {
                type: ASTNodeType.NumericLiteral,
                value: 42,
              },
            },
          ],
        },
      ],
    });
  });

  it("should parse simple variable declaration with no initializer", () => {
    const program = `let x;`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.VariableStatement,
          declarations: [
            {
              type: ASTNodeType.VariableDeclaration,
              id: {
                type: ASTNodeType.Identifier,
                name: "x",
              },
              init: null,
            },
          ],
        },
      ],
    });
  });

  it("should parse multiple variable declaration with no initializer", () => {
    const program = `let x, y;`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.VariableStatement,
          declarations: [
            {
              type: ASTNodeType.VariableDeclaration,
              id: {
                type: ASTNodeType.Identifier,
                name: "x",
              },
              init: null,
            },
            {
              type: ASTNodeType.VariableDeclaration,
              id: {
                type: ASTNodeType.Identifier,
                name: "y",
              },
              init: null,
            },
          ],
        },
      ],
    });
  });

  it("should parse multiple variable declaration with initializers", () => {
    const program = `let x, y = 42;`;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.VariableStatement,
          declarations: [
            {
              type: ASTNodeType.VariableDeclaration,
              id: {
                type: ASTNodeType.Identifier,
                name: "x",
              },
              init: null,
            },
            {
              type: ASTNodeType.VariableDeclaration,
              id: {
                type: ASTNodeType.Identifier,
                name: "y",
              },
              init: {
                type: ASTNodeType.NumericLiteral,
                value: 42,
              },
            },
          ],
        },
      ],
    });
  });
});
