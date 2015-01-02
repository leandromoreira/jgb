var jgb = jgb || {}

jgb.Rom = function(byteArray){
  this.rawRom = byteArray
  this.title = (function(){
    var title = ""
    for(var address = 0x0134; address <= 0x0143 ; address++){
      title += String.fromCharCode(byteArray[address])
    }
    return title.trim();
  })()

  this.manufacturer = (function(){
    var manufacturer = ""
    for(var address = 0x013F; address <= 0x0142 ; address++){
      manufacturer += String.fromCharCode(byteArray[address])
    }
    return manufacturer.trim();
  })()

  this.licenseCode = (function(){
    var licenseCode = ""
    for(var address = 0x0144; address <= 0x0145 ; address++){
      licenseCode += byteArray[address].toString()
    }
    return licenseCode.trim() === "" ? String.fromCharCode(byteArray[0x014B]) : licenseCode.trim();
  })()

  this.cartridgeType = (function(){
    var types = []
    types[0x00]="ROM ONLY"
    types[0x01]="MBC1"
    types[0x02]="MBC1+RAM"
    types[0x03]="MBC1+RAM+BATTERY"
    types[0x05]="MBC2"
    types[0x06]="MBC2+BATTERY"
    types[0x08]="ROM+RAM"
    types[0x09]="ROM+RAM+BATTERY"
    types[0x0B]="MMM01"
    types[0x0C]="MMM01+RAM"
    types[0x0D]="MMM01+RAM+BATTERY"
    types[0x0F]="MBC3+TIMER+BATTERY"
    types[0x10]="MBC3+TIMER+RAM+BATTERY"
    types[0x11]="MBC3"
    types[0x12]="MBC3+RAM"
    types[0x13]="MBC3+RAM+BATTERY"
    types[0x15]="MBC4"
    types[0x16]="MBC4+RAM"
    types[0x17]="MBC4+RAM+BATTERY"
    types[0x19]="MBC5"
    types[0x1A]="MBC5+RAM"
    types[0x1B]="MBC5+RAM+BATTERY"
    types[0x1C]="MBC5+RUMBLE"
    types[0x1D]="MBC5+RUMBLE+RAM"
    types[0x1E]="MBC5+RUMBLE+RAM+BATTERY"
    types[0xFC]="POCKET CAMERA"
    types[0xFD]="BANDAI TAMA5"
    types[0xFE]="HuC3"
    types[0xFF]="HuC1+RAM+BATTERY"
    return types[byteArray[0x0147]]
  })()

  this.size = (function(){
    var types = []
    types[0x00] = "32KByte"
    types[0x01] = "64KByte"
    types[0x02] = "128KByte"
    types[0x03] = "256KByte"
    types[0x04] = "512KByte"
    types[0x05] = "1MByte"
    types[0x06] = "2MByte"
    types[0x07] = "4MByte"
    types[0x52] = "1.1MByte"
    types[0x53] = "1.2MByte"
    types[0x54] = "1.5MByte"
    return types[byteArray[0x0148]]
  })()

  this.ramSize = (function(){
    var types = []
    types[0x00] = "None"
    types[0x01] = "2KByte"
    types[0x02] = "8KByte"
    types[0x03] = "32KByte"
    return types[byteArray[0x0149]]
  })()

  this.ramVersion = (function(){
    return byteArray[0x014C].toString()
  })()

  this.headerChecksum = (function(){
    return byteArray[0x014D]
  })()

  this.globalChecksum = (function(){
    var bin = new jgb.Binary()
    return bin.wordFrom(byteArray[0x014E], byteArray[0x014F])
  })()
}
