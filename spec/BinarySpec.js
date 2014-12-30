describe("Binary", function() {
  var bin

  beforeEach(function () {
    bin = new jgb.Binary()
  });


  it("creates a word from 2 bytes", function() {
    expect(bin.wordFrom(0xAA, 0xFF)).toEqual(0xFFAA);
  });

  it("returns first/second byte from word", function() {
    expect(bin.firstByteFrom(0xAAFF)).toEqual(0xAA);
    expect(bin.secondByteFrom(0xAAFF)).toEqual(0xFF);
  });

  it("converts to hexa", function() {
    expect(bin.toHexa(255)).toEqual("0xFF");
  });

  it("converts to binary", function() {
    expect(bin.toBinary(2)).toEqual("0b10");
  });
});
