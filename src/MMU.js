var jgb = jgb || {}

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
