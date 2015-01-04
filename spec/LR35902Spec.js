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
});
