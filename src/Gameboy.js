var jgb = jgb || {}

jgb.Gameboy = function(romByteArray){
  this.rom = new jgb.Rom(romByteArray)
  this.memoryBankControllers = new jgb.MemoryBankControllers(this.rom)
  this.memory = new jgb.MMU(this.memoryBankControllers)
  this.cpu = new jgb.LR35902(this.memory)

  this.start = function(){
    //boot should start with PC at 0x0000 (every gb cart has bios within it)
    //but we're gonna skip to 0x100, we also should check nintendo logo [0104-0133] and checksum
  }
}
