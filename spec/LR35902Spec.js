describe("LR35902", function() {
  var cpu

  beforeEach(function () {
    cpu = new jgb.LR35902(new jgb.MMU())
  });

  it("dissambles instruction with no operands", function() {
    cpu.memory.writeByte(0x0000, 00)
    cpu.step()

    expect(cpu.assemblerLine).toEqual("NOP");
  });

  it("does NOP", function() {
    cpu.memory.writeByte(0x0000, 00)
    cpu.step()

    expect(cpu.pc).toEqual(0x0001);
  });
});
