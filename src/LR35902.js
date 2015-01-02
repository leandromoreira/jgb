var jgb = jgb || {}

jgb.LR35902 = function(memory){
  self = this // I dunno JS

  this.bin = new jgb.Binary()
  this.cycles = 0
  this.speed = 4194304

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

  var oneByte = function(){ return 1 }
  var twoBytes = function(){ return 2 }
  var threeBytes = function(){ return 3 }
  var cycles = function(number){return function(){return number}}
  var mnemonic = function(assemble){return function(){return assemble}}
  var doNothing = function(){}

  this.opCodes = []
  this.opCodes[0x00] =
    //NOP
    {
      mnemonic: mnemonic("NOP"), jumpsTo: oneByte, cycles: cycles(4), exec: doNothing
    }
  this.opCodes[0x10] =
    //STOP
    {
      mnemonic: mnemonic("STOP"), jumpsTo: twoBytes, cycles: cycles(12), exec: doNothing
    }

  // ############ LD xx, immediate
  this.opCodes[0x01] =
    //LD BC, 0xXXXX
    {
      mnemonic: function(){return "LD BC, "+this.arg}, jumpsTo: threeBytes, cycles: cycles(12),
      exec: function(){
        this.arg = self.bin.toHexa(self.memory.readWord(self.pc + 1))
        self.c = self.memory.readByte(self.pc+1)
        self.b = self.memory.readByte(self.pc+2)
      }
    }
  this.opCodes[0x11] =
    //LD DE, 0xXXXX
    {
      mnemonic: function(){return "LD DE, "+this.arg}, jumpsTo: threeBytes, cycles: cycles(12),
      exec: function(){
        this.arg = self.bin.toHexa(self.memory.readWord(self.pc + 1))
        self.e = self.memory.readByte(self.pc+1)
        self.d = self.memory.readByte(self.pc+2)
      }
    }
  this.opCodes[0x21] =
    //LD HL, 0xXXXX
    {
      mnemonic: function(){return "LD HL, "+this.arg}, jumpsTo: threeBytes, cycles: cycles(12),
      exec: function(){
        this.arg = self.bin.toHexa(self.memory.readWord(self.pc + 1))
        self.l = self.memory.readByte(self.pc+1)
        self.h = self.memory.readByte(self.pc+2)
      }
    }

  this.opCodes[0x31] =
    //LD SP, 0xXXXX
    {
      mnemonic: function(){return "LD SP, "+this.arg}, jumpsTo: threeBytes, cycles: cycles(12),
      exec: function(){
        var nextWord = self.memory.readWord(self.pc + 1)
        self.sp = nextWord
        this.arg = self.bin.toHexa(nextWord)
      }
    }

  this.step = function(){
    var opCode = this.memory.readByte(this.pc)
    var instruction = this.opCodes[opCode]

    instruction.exec()
    this.assemblerLine = instruction.mnemonic()

    this.pc += instruction.jumpsTo()
    this.cycles += instruction.cycles()
  }
}

