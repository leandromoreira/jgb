var jgb = jgb || {}

jgb.LR35902 = function(memory){
  this.pc = 0x0000
  this.memory = memory
  this.assemblerLine = null

  this.opCodes = [
    //NOP
    {
      mnemonic: "NOP", size: 1, cycles: 4,
      exec: function(){}
    }
  ]

  this.step = function(){
    var opCode = this.memory.readByte(this.pc)
    var instruction = this.opCodes[opCode]

    instruction.exec()
    this.assemblerLine = instruction.mnemonic

    this.pc += instruction.size
  }
}

