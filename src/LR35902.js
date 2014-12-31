var jgb = jgb || {}

jgb.LR35902 = function(memory){
  self = this
  this.bin = new jgb.Binary()
  this.cycles = 0
  this.pc = 0x0000
  this.b = 0x0000
  this.c = 0x0000
  this.memory = memory
  this.assemblerLine = null

  this.opCodes = [
    //NOP
    {
      mnemonic: function(){return "NOP"}, size: 1, cycles: 4,
      exec: function(){}
    },
    //LD BC, 0xXXXX
    {
      mnemonic: function(){return "LD BC, "+this.arg}, size: 3, cycles: 12,
      exec: function(){
        var nextWord = self.memory.readWord(self.pc + 1)
        self.b = self.bin.firstByteFrom(nextWord)
        self.c = self.bin.secondByteFrom(nextWord)
        this.arg = self.bin.toHexa(nextWord)
      }
    }
  ]

  this.step = function(){
    var opCode = this.memory.readByte(this.pc)
    var instruction = this.opCodes[opCode]

    instruction.exec()
    this.assemblerLine = instruction.mnemonic()

    this.pc += instruction.size
    this.cycles += instruction.cycles
  }
}

