describe("LR35902", function() {
  it("has program counter", function() {
    var cpu = new jgb.LR35902()
    expect(cpu.PC).toEqual(0x0000);
  });
});
