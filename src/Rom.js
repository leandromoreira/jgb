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
      licenseCode += String.fromCharCode(byteArray[address])
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
}
