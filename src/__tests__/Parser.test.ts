describe("Root test", () => {
  it("should work", () => {
    // arrange
    const program = `42`;

    // act
    const ast = parser.parse(program);

    // assert
    expect(ast).toEqual({
      type: "Program",
      body: {
        type: "NumericLiteral",
        value: 42,
      },
    });
  });
});
