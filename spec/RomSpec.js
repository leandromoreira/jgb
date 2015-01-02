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
    expect(rom.licenseCode).toEqual("00");
  });

  it("contains cartridge type", function() {
    expect(rom.cartridgeType).toEqual("MBC1");
  });

  it("contains size", function() {
    expect(rom.size).toEqual("64KByte");
  });

  it("contains ram size", function() {
    expect(rom.ramSize).toEqual("None");
  });

  it("contains rom size", function() {
    expect(rom.ramVersion).toEqual("1");
  });

  it("contains header checksum", function() {
    expect(rom.headerChecksum).toEqual(157);
  });

  it("contains global checksum", function() {
    expect(rom.globalChecksum).toEqual(57984);
  });
});
