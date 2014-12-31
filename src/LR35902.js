var jgb = jgb || {}

jgb.LR35902 = function(memory){
  self = this // I dunno JS

  this.bin = new jgb.Binary()
  this.cycles = 0

  //### LR35902 registers ###
  this.pc = 0x0000
  this.sp = 0x0000
  this.a = 0x0000 //accumulator
  this.b = 0x0000
  this.c = 0x0000
  this.d = 0x0000
  this.e = 0x0000
  this.f = 0x0000 //flag
  this.h = 0x0000
  this.l = 0x0000
  //###
  this.memory = memory
  this.assemblerLine = null

  this.opCodes = []
  this.opCodes[0x00] =
    //NOP
    {
      mnemonic: function(){return "NOP"}, size: 1, cycles: 4,
      exec: function(){}
    }
  this.opCodes[0x10] =
    //STOP
    {
      mnemonic: function(){return "STOP"}, size: 2, cycles: 12,
      exec: function(){}
    }

  // ############ LD xx, immediate
  this.opCodes[0x01] =
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

  this.step = function(){
    var opCode = this.memory.readByte(this.pc)
    var instruction = this.opCodes[opCode]

    instruction.exec()
    this.assemblerLine = instruction.mnemonic()

    this.pc += instruction.size
    this.cycles += instruction.cycles
  }
}

