import { ASTNode } from "../ASTFactory";

describe("Block tests", () => {
  it("should parse an empty statement", () => {
    const program = `
      ;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNode.Program,
      body: [
        {
          type: ASTNode.EmptyStatement,
        },
      ],
    });
  });
});
