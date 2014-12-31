var jgb = jgb || {}
jgb.MMU = jgb.MMU || {}

jgb.MMU.BANK0_ROM_START = 0x0000
jgb.MMU.BANK0_ROM_END = 0x3FFF
jgb.MMU.BANKN_ROM_START = 0x4000
jgb.MMU.BANKN_ROM_END = 0x7FFF

jgb.MMU.VRAM_START = 0x8000
jgb.MMU.VRAM_END = 0x9FFF

jgb.MMU.EXT_RAM_START = 0xA000
jgb.MMU.EXT_RAM_END = 0xBFFF

jgb.MMU.WRAM_BANK0_START = 0xC000
jgb.MMU.WRAM_BANK0_END = 0xCFFF
jgb.MMU.WRAM_BANK1_START = 0xD000
jgb.MMU.WRAM_BANK1_END = 0xDFFF

jgb.MMU.WRAM_MIRROR_START = 0xE000
jgb.MMU.WRAM_MIRROR_END = 0xFDFF

jgb.MMU.OAM_START = 0xFE00
jgb.MMU.OAM_END = 0xFE9F

jgb.MMU.IO_START = 0xFF00
jgb.MMU.IO_END = 0xFF7F

jgb.MMU.HRAM_START = 0xFF80
jgb.MMU.HRAM_END = 0xFFFE

jgb.MMU.INTERRUPT_ENABLE = 0xFFFF

jgb.MMU = function(){
  var memory = new Uint8Array(0xFFFF + 1)
  var bin = new jgb.Binary()

  this.writeByte = function(address, byte) { memory[address] = byte }

  this.readByte = function(address) { return memory[address] }

  this.writeWord = function(address, word) {
    memory[address] = bin.secondByteFrom(word)
    memory[address+1] = bin.firstByteFrom(word)
  }

  this.readWord = function(address){ return bin.wordFrom(memory[address], memory[address+1]) }

  this.reset = function(){ memory = new Uint8Array(0xFFFF + 1) }
}
