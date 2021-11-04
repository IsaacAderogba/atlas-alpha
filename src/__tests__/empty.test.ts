import { ASTNodeType } from "../ASTFactory";

describe("Empty tests", () => {
  it("should parse an empty statement", () => {
    const program = `
      ;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: ASTNodeType.Program,
      body: [
        {
          type: ASTNodeType.EmptyStatement,
        },
      ],
    });
  });
});
