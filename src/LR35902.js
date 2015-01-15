var jgb = jgb || {}

jgb.LR35902 = function(memory){
  self = this // I dunno JS

  this.bin = new jgb.Binary()
  this.cycles = 0
  this.speed = 4194304

  //### LR35902 registers ###
  this.pc = 0x0000
  this.sp = 0x0000
  this.a = 0x00 //accumulator
  this.b = 0x00
  this.c = 0x00
  this.d = 0x00
  this.e = 0x00
  this.f = 0x00 //flag
  this.h = 0x00
  this.l = 0x00
  //###
  this.memory = memory
  this.assemblerLine = null

  var oneByte = function(){ return 1 }
  var twoBytes = function(){ return 2 }
  var threeBytes = function(){ return 3 }
  var cycles = function(number){return function(){return number}}
  var mnemonic = function(assemble){return function(){return assemble}}
  var doNothing = function(){}

  this.step = function(){
    var opCode = this.memory.readByte(this.pc)
    var instruction = this.opCodes[opCode]

    instruction.exec()
    this.assemblerLine = instruction.mnemonic()

    this.pc += instruction.jumpsTo()
    this.cycles += instruction.cycles()
  }

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

  //################ LD (xx), A
  this.opCodes[0x02] =
    //LD (BC), A
    {
      mnemonic: mnemonic("LD (BC), A"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        self.memory.writeByte(self.bin.wordFrom(self.c, self.b), self.a)
      }
    }

  this.opCodes[0x12] =
    //LD (DE), A
    {
      mnemonic: mnemonic("LD (DE), A"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        self.memory.writeByte(self.bin.wordFrom(self.e, self.d), self.a)
      }
    }

  this.opCodes[0x22] =
    //LD (HL+), A
    {
      mnemonic: mnemonic("LD (HL+), A"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        var hl = self.bin.wordFrom(self.l, self.h)
        self.memory.writeByte(hl, self.a)
        hl = (hl + 1) & 0xFFFF
        self.h = self.bin.firstByteFrom(hl)
        self.l = self.bin.secondByteFrom(hl)
      }
    }

  this.opCodes[0x32] =
    //LD (HL-), A
    {
      mnemonic: mnemonic("LD (HL-), A"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        var hl = self.bin.wordFrom(self.l, self.h)
        self.memory.writeByte(hl, self.a)
        hl = (hl - 1) & 0xFFFF
        self.h = self.bin.firstByteFrom(hl)
        self.l = self.bin.secondByteFrom(hl)
      }
    }

  //################ INC
  this.opCodes[0x03] =
    //INC BC
    {
      mnemonic: mnemonic("INC BC"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        var bc = (self.bin.wordFrom(self.c, self.b) + 1) & 0xFFFF
        self.b = self.bin.firstByteFrom(bc)
        self.c = self.bin.secondByteFrom(bc)
      }
    }

  this.opCodes[0x13] =
    //INC DE
    {
      mnemonic: mnemonic("INC DE"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        var de = (self.bin.wordFrom(self.e, self.d) + 1) & 0xFFFF
        self.d = self.bin.firstByteFrom(de)
        self.e = self.bin.secondByteFrom(de)
      }
    }

  this.opCodes[0x23] =
    //INC HL
    {
      mnemonic: mnemonic("INC HL"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        var hl = (self.bin.wordFrom(self.l, self.h) + 1) & 0xFFFF
        self.h = self.bin.firstByteFrom(hl)
        self.l = self.bin.secondByteFrom(hl)
      }
    }

  this.opCodes[0x33] =
    //INC SP
    {
      mnemonic: mnemonic("INC SP"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        self.sp = (self.sp + 1) & 0xFFFF
      }
    }
}

