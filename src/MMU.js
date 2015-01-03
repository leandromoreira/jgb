var jgb = jgb || {}

jgb.MMU = function(memoryBankControllers){
  var memory = new Uint8Array(0xFFFF + 1)
  this.memoryBank = memoryBankControllers
  var bin = new jgb.Binary()

  this.writeByte = function(address, byte) {
    if (address >= this.BANK0_ROM_START && address <= this.BANKN_ROM_END) {
      this.memoryBank.writeByte(address, byte)
    } else {
      memory[address] = byte
    }
  }

  this.readByte = function(address) {
    if (address >= this.BANK0_ROM_START && address <= this.BANKN_ROM_END) {
      return this.memoryBank.readByte(address)
    } else {
      return memory[address]
    }
  }

  this.writeWord = function(address, word) {
    this.writeByte(address, bin.secondByteFrom(word))
    this.writeByte(address+1, bin.firstByteFrom(word))
  }

  this.readWord = function(address) {
    return bin.wordFrom(this.readByte(address), this.readByte(address+1))
  }

  this.reset = function(){ memory = new Uint8Array(0xFFFF + 1) }

  this.BANK0_ROM_START = 0x0000
  this.BANK0_ROM_END = 0x3FFF
  this.BANKN_ROM_START = 0x4000
  this.BANKN_ROM_END = 0x7FFF

  this.VRAM_START = 0x8000
  this.VRAM_END = 0x9FFF

  this.EXT_RAM_START = 0xA000
  this.EXT_RAM_END = 0xBFFF

  this.WRAM_BANK0_START = 0xC000
  this.WRAM_BANK0_END = 0xCFFF
  this.WRAM_BANK1_START = 0xD000
  this.WRAM_BANK1_END = 0xDFFF

  this.WRAM_MIRROR_START = 0xE000
  this.WRAM_MIRROR_END = 0xFDFF

  this.OAM_START = 0xFE00
  this.OAM_END = 0xFE9F

  this.IO_START = 0xFF00
  this.IO_END = 0xFF7F

  this.HRAM_START = 0xFF80
  this.HRAM_END = 0xFFFE

  this.INTERRUPT_ENABLE = 0xFFFF
}
