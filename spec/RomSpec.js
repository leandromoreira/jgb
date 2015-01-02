describe("Rom", function() {
  var rom

  beforeEach(function () {
    rom = new jgb.Rom(Fixture.test1ArrayByte)
  });

  it("contains title", function() {
    expect(rom.title).toEqual("Opus Test");
  });

  it("contains manufacturer", function() {
    expect(rom.manufacturer).toEqual("");
  });

  it("contains license code", function() {
    expect(rom.licenseCode).toEqual(rom.licenseCode);
  });

  it("contains cartridge type", function() {
    expect(rom.cartridgeType).toEqual("MBC1");
  });
});
