var jgb = jgb || {}

jgb.Rom = function(byteArray){
  this.title = (function(){
    var title = ""
    for(var address = 0x0134; address <= 0x0143 ; address++){
      title += String.fromCharCode(byteArray[address])
    }
    return title.trim();
  })()
}
