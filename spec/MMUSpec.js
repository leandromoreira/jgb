describe("MMU", function() {
  var mmu

  beforeEach(function () {
    var rom = new jgb.Rom(Fixture.test1ArrayByte)
    var memoryBankControllers = new jgb.MemoryBankControllers(rom)
    mmu = new jgb.MMU(memoryBankControllers)
  });

  it("writes/reads a byte", function() {
    mmu.writeByte(mmu.WRAM_BANK0_START+0x0000, 0xCA)
    var fromMemory = mmu.readByte(mmu.WRAM_BANK0_START+0x0000)
    expect(fromMemory).toEqual(0xCA);
  });

  it("writes/reads a word", function() {
    mmu.writeWord(0x0010, 0xCAFE)
    var fromMemory = mmu.readWord(0x0010)
    expect(fromMemory).toEqual(0xCAFE);
  });

  it("resets", function() {
    mmu.writeByte(mmu.WRAM_BANK0_START+0x0000, 0xCA)
    mmu.writeByte(mmu.WRAM_BANK0_START+0x0001, 0xCA)
    mmu.writeByte(mmu.WRAM_BANK0_START+0x0002, 0xCA)
    mmu.writeByte(mmu.WRAM_BANK0_START+0x0003, 0xCA)

    mmu.reset()

    expect(mmu.readByte(mmu.WRAM_BANK0_START+0x0000)).toEqual(0x00);
  });
});
