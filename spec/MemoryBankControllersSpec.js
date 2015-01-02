describe("MemoryBankControllers", function() {
  it("maps directly to rom", function(){
    var rom = new jgb.Rom(Fixture.test1ArrayByte)
    rom.cartridgeTypeId = 0x00

    var memoryBank = new jgb.MemoryBankControllers(rom)

    expect(memoryBank.readByte(0x0103)).toEqual(rom.rawRom[0x0103])
  })
});
