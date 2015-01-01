var jgb = jgb || {}

jgb.Gameboy = function(){
  this.memory = new MMU()
  this.cpu = new LR35902()
  this.cpu.memory = this.memory

  this.start = function(){//loop}
}
