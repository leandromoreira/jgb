var jgb = jgb || {}

jgb.MemoryBankControllers = function(rom){
  self = this
  this.mappers = []
  this.rom = rom

  this.readByte = function(address) {
    return this.mappers[rom.cartridgeTypeId].readByte(address)
  }

  this.writeByte = function(address, value) {
    return this.mappers[rom.cartridgeTypeId].writeByte(address, value)
  }

  //ROM only
  this.mappers[0x00] = {
    readByte: function(address) {
      return self.rom.rawRom[address]
    },
    writeByte: function(address, value) {
      throw "Read-only memory"
    }
  }
  //MBC1
  this.mappers[0x01] = {
    readByte: function(address) {
      throw "To be implemented"
    },
    writeByte: function(address, value) {
      throw "To be implemented"
    }
  }
}
