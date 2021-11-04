describe("Root test", () => {
  it("should work", () => {
    // arrange
    const program = `42`;

    // act
    const ast = parser.parse(program);

    // assert
    console.log(JSON.stringify(ast, null, 2))
  });
});
