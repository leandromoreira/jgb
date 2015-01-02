var jgb = jgb || {}

jgb.Gameboy = function(romByteArray){
  this.rom = new jgb.Rom(romByteArray)
  this.memory = new jgb.MMU()
  this.cpu = new jgb.LR35902()
  this.cpu.memory = this.memory

  this.start = function(){}
}
