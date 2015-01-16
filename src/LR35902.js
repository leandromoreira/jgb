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
  //Flags
  this.flagZero = 0
  this.flagCarry = 0
  this.flagHalfCarry = 0
  this.flagSubtract = 0
  //###

  var checkFlagZero = function(v){self.flagZero = (v === 0x0)? 0x1 : 0x0}
  var checkFlagHalfCarry = function(v){self.flagHalfCarry = ((v & 0xF) == 0) ? 0x1 : 0x0}

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

  this.opCodes[0x04] =
    //INC B
    {
      mnemonic: mnemonic("INC B"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.b = (self.b + 1) & 0xFF
        self.flagSubtract = 0x0
        checkFlagHalfCarry(self.b)
        checkFlagZero(self.b)
      }
    }

  this.opCodes[0x14] =
    //INC D
    {
      mnemonic: mnemonic("INC D"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.d = (self.d + 1) & 0xFF
        self.flagSubtract = 0x0
        checkFlagHalfCarry(self.d)
        checkFlagZero(self.d)
      }
    }

  this.opCodes[0x24] =
    //INC H
    {
      mnemonic: mnemonic("INC H"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.h = (self.h + 1) & 0xFF
        self.flagSubtract = 0x0
        checkFlagHalfCarry(self.h)
        checkFlagZero(self.h)
      }
    }

  this.opCodes[0x34] =
    //INC (HL)
    {
      mnemonic: mnemonic("INC (HL)"), jumpsTo: oneByte, cycles: cycles(12),
      exec: function(){
        var v = ((self.memory.readByte(self.bin.wordFrom(self.l, self.h)) + 1 ) & 0xFF)
        self.memory.writeByte(self.bin.wordFrom(self.l, self.h), v)

        self.flagSubtract = 0x0
        checkFlagHalfCarry(v)
        checkFlagZero(v)
      }
    }

  this.opCodes[0x0C] =
    //INC C
    {
      mnemonic: mnemonic("INC C"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.c = (self.c + 1) & 0xFF
        self.flagSubtract = 0x0
        checkFlagHalfCarry(self.c)
        checkFlagZero(self.c)
      }
    }

  this.opCodes[0x1C] =
    //INC E
    {
      mnemonic: mnemonic("INC E"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.e = (self.e + 1) & 0xFF
        self.flagSubtract = 0x0
        checkFlagHalfCarry(self.e)
        checkFlagZero(self.e)
      }
    }

  this.opCodes[0x2C] =
    //INC L
    {
      mnemonic: mnemonic("INC L"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.l = (self.l + 1) & 0xFF
        self.flagSubtract = 0x0
        checkFlagHalfCarry(self.l)
        checkFlagZero(self.l)
      }
    }

  this.opCodes[0x3C] =
    //INC A
    {
      mnemonic: mnemonic("INC A"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.a = (self.a + 1) & 0xFF
        self.flagSubtract = 0x0
        checkFlagHalfCarry(self.a)
        checkFlagZero(self.a)
      }
    }

  this.opCodes[0x05] =
    //DEC B
    {
      mnemonic: mnemonic("DEC B"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.b = (self.b - 1) & 0xFF
        self.flagSubtract = 0x1
        checkFlagHalfCarry(self.b)
        checkFlagZero(self.b)
      }
    }

  this.opCodes[0x15] =
    //DEC D
    {
      mnemonic: mnemonic("DEC D"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.d = (self.d - 1) & 0xFF
        self.flagSubtract = 0x1
        checkFlagHalfCarry(self.d)
        checkFlagZero(self.d)
      }
    }

  this.opCodes[0x25] =
    //DEC H
    {
      mnemonic: mnemonic("DEC H"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.h = (self.h - 1) & 0xFF
        self.flagSubtract = 0x1
        checkFlagHalfCarry(self.h)
        checkFlagZero(self.h)
      }
    }

  this.opCodes[0x35] =
    //DEC (HL)
    {
      mnemonic: mnemonic("DEC (HL)"), jumpsTo: oneByte, cycles: cycles(12),
      exec: function(){
        var v = ((self.memory.readByte(self.bin.wordFrom(self.l, self.h)) - 1 ) & 0xFF)
        self.memory.writeByte(self.bin.wordFrom(self.l, self.h), v)

        self.flagSubtract = 0x1
        checkFlagHalfCarry(v)
        checkFlagZero(v)
      }
    }

  this.opCodes[0x0D] =
    //DEC C
    {
      mnemonic: mnemonic("DEC C"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.c = (self.c - 1) & 0xFF
        self.flagSubtract = 0x1
        checkFlagHalfCarry(self.c)
        checkFlagZero(self.c)
      }
    }

  this.opCodes[0x1D] =
    //DEC E
    {
      mnemonic: mnemonic("DEC E"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.e = (self.e - 1) & 0xFF
        self.flagSubtract = 0x1
        checkFlagHalfCarry(self.e)
        checkFlagZero(self.e)
      }
    }

  this.opCodes[0x2D] =
    //DEC L
    {
      mnemonic: mnemonic("DEC L"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.l = (self.l - 1) & 0xFF
        self.flagSubtract = 0x1
        checkFlagHalfCarry(self.l)
        checkFlagZero(self.l)
      }
    }

  this.opCodes[0x3D] =
    //DEC A
    {
      mnemonic: mnemonic("DEC A"), jumpsTo: oneByte, cycles: cycles(4),
      exec: function(){
        self.a = (self.a - 1) & 0xFF
        self.flagSubtract = 0x1
        checkFlagHalfCarry(self.a)
        checkFlagZero(self.a)
      }
    }

  this.opCodes[0x0B] =
    //DEC BC
    {
      mnemonic: mnemonic("DEC BC"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        var bc = (self.bin.wordFrom(self.c, self.b) - 1) & 0xFFFF
        self.b = self.bin.firstByteFrom(bc)
        self.c = self.bin.secondByteFrom(bc)
      }
    }

  this.opCodes[0x1B] =
    //DEC DE
    {
      mnemonic: mnemonic("DEC DE"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        var de = (self.bin.wordFrom(self.e, self.d) - 1) & 0xFFFF
        self.d = self.bin.firstByteFrom(de)
        self.e = self.bin.secondByteFrom(de)
      }
    }

  this.opCodes[0x2B] =
    //DEC HL
    {
      mnemonic: mnemonic("DEC HL"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        var hl = (self.bin.wordFrom(self.l, self.h) - 1) & 0xFFFF
        self.h = self.bin.firstByteFrom(hl)
        self.l = self.bin.secondByteFrom(hl)
      }
    }

  this.opCodes[0x3B] =
    //DEC SP
    {
      mnemonic: mnemonic("DEC SP"), jumpsTo: oneByte, cycles: cycles(8),
      exec: function(){
        self.sp = (self.sp - 1) & 0xFFFF
      }
    }

  //LOAD X,d8
  var loadXd8Instructions = [
    {opcode: 0x06, r: "B"}, {opcode: 0x16, r: "D"}, {opcode: 0x26, r: "H"},
    {opcode: 0x0E, r: "C"}, {opcode: 0x1E, r: "E"}, {opcode: 0x2E, r: "L"},
    {opcode: 0x3E, r: "A"}
  ]

  for (var index = 0; index < loadXd8Instructions.length; ++index) {
    (function(instruction){
      self.opCodes[instruction.opcode] = {
        mnemonic: function(){return "LD " + instruction.r + ", " + instruction.arg}, jumpsTo: twoBytes, cycles: cycles(8),
        exec: function(){
          instruction.arg = self.memory.readByte(self.pc+1)
          self[instruction.r.toLowerCase()] = instruction.arg  & 0xFF
        }
      }
    })(loadXd8Instructions[index])
  }

  this.opCodes[0x36] =
    //LD (HL), d8
    {
      mnemonic: function(){return "LD (HL), " + this.arg}, jumpsTo: twoBytes, cycles: cycles(12),
      exec: function(){
        var hl = self.bin.wordFrom(self.l, self.h)
        this.arg = self.memory.readByte(self.pc+1)
        self.memory.writeByte(hl, this.arg)
      }
    }


}
