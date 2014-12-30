describe("MMU", function() {
  var mmu

  beforeEach(function () {
    mmu = new jgb.MMU()
  });

  it("writes/reads a byte", function() {
    mmu.writeByte(0x0000, 0xCA)
    var fromMemory = mmu.readByte(0x0000)
    expect(fromMemory).toEqual(0xCA);
  });

  it("writes/reads a word", function() {
    mmu.writeWord(0x0010, 0xCAFE)
    var fromMemory = mmu.readWord(0x0010)
    expect(fromMemory).toEqual(0xCAFE);
  });

  it("resets", function() {
    mmu.writeByte(0x0000, 0xCA)
    mmu.writeByte(0x0001, 0xCA)
    mmu.writeByte(0x0002, 0xCA)
    mmu.writeByte(0x0003, 0xCA)

    mmu.reset()

    expect(mmu.readByte(0x0000)).toEqual(0x00);
  });
});
