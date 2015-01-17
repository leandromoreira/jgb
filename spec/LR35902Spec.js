describe("LR35902", function() {
  var cpu
  var mmu

  beforeEach(function () {
    var rom = new jgb.Rom(Fixture.test1ArrayByte)
    var memoryBankControllers = new jgb.MemoryBankControllers(rom)
    mmu = new jgb.MMU(memoryBankControllers)
    cpu = new jgb.LR35902(mmu)
    cpu.pc = mmu.WRAM_BANK0_START
  });

  it("dissambles instruction with no operands", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 00)
    cpu.step()

    expect(cpu.assemblerLine).toEqual("NOP");
  });

  it("dissambles instruction with word immediate operand", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 01)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0001, 0xAA)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0002, 0xFF)

    cpu.step()

    expect(cpu.assemblerLine).toEqual("LD BC, 0xFFAA");
  });

  it("counts cycles per instruction", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x1)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0001, 0xAA)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0002, 0xFF)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0003, 0x0)

    cpu.step()
    cpu.step()

    expect(cpu.cycles).toEqual(16);
  });

  it("does NOP", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 00)
    cpu.step()

    expect(cpu.pc).toEqual(mmu.WRAM_BANK0_START+0x0001);
  });

  it("does LD BC, 0xXXXX", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 01)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0001, 0xAA)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0002, 0xFF)

    cpu.step()

    expect(cpu.b).toEqual(0xFF);
    expect(cpu.c).toEqual(0xAA);
  });

  it("does LD (BC), A", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x02)
    cpu.b = 0xAA
    cpu.c = 0xFF
    cpu.a = 0xED

    cpu.step()

    expect(cpu.memory.readByte(0xAAFF)).toEqual(0xED);
  });

  it("LD (HL+), A", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x22)
    cpu.l = 0xAA
    cpu.h = 0xFF
    cpu.a = 0x15

    cpu.step()

    expect(cpu.memory.readByte(0xFFAA)).toEqual(0x15);
    expect(cpu.h).toEqual(0xFF);
    expect(cpu.l).toEqual(0xAB);
  });

  it("INC BC", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x03)
    cpu.b = 0xAA
    cpu.c = 0xFF
    // bc = 0xAAFF (0xAAFF + 1 = 0xAB00)
    cpu.step()

    expect(cpu.b).toEqual(0xAB);
    expect(cpu.c).toEqual(0x00);
  });

  it("INC B", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x04)
    cpu.b = 0xAA

    cpu.step()

    expect(cpu.b).toEqual(0xAB);
    expect(cpu.flagZero).toEqual(0x0);
    expect(cpu.flagSubtract).toEqual(0x0);
    expect(cpu.flagHalfCarry).toEqual(0x0);

    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0001, 0x04)
    cpu.b = 0xFF

    cpu.step()

    expect(cpu.b).toEqual(0x00);
    expect(cpu.flagZero).toEqual(0x1);
    expect(cpu.flagHalfCarry).toEqual(0x1);
  });

  it("INC (HL)", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x34)
    cpu.memory.writeByte(0xC0AA, 0x1)
    cpu.h = 0xC0
    cpu.l = 0xAA

    cpu.step()

    expect(cpu.memory.readByte(0xC0AA)).toEqual(0x2);
  });

  it("DEC B", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x05)
    cpu.b = 0xAA

    cpu.step()

    expect(cpu.b).toEqual(0xA9);
    expect(cpu.flagSubtract).toEqual(0x1);
  });

  it("LD B,d8", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x06)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0001, 0xBB)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0002, 0x06)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0003, 0xCC)
    cpu.b = 0xAA

    cpu.step()

    expect(cpu.b).toEqual(0xBB);
    expect(cpu.assemblerLine).toEqual("LD B, 187");

    cpu.step()

    expect(cpu.b).toEqual(0xCC);
    expect(cpu.assemblerLine).toEqual("LD B, 204");
  });

  it("LD D,d8", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x16)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0001, 0xBC)
    cpu.d = 0xAA

    cpu.step()

    expect(cpu.d).toEqual(0xBC);
    expect(cpu.assemblerLine).toEqual("LD D, 188");
  });

  it("LD (HL),d8", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x36)
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0001, 0xFA)
    cpu.h = 0xAA
    cpu.l = 0x11

    expect(cpu.memory.readByte(0xAA11)).toEqual(0x00);

    cpu.step()

    expect(cpu.memory.readByte(0xAA11)).toEqual(0xFA);
  });

  it("RLCA", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x07)
    cpu.a = 0x2 //10 << 1 == 100

    cpu.step()

    expect(cpu.a).toEqual(parseInt("100",2));
  });

  it("RRCA", function() {
    cpu.memory.writeByte(mmu.WRAM_BANK0_START+0x0000, 0x0F)
    cpu.a = 0x2 //10 >> 1 == 1

    cpu.step()

    expect(cpu.a).toEqual(1);
  });
});
