var jgb = jgb || {}

jgb.FillInfo = function(){
  var romInfo = window.emulator.rom
  var romInfoHtml = "<b>Title:</b> " + romInfo.title
  romInfoHtml += "<br><b>Type:</b> " + romInfo.cartridgeType
  romInfoHtml += "<br><b>Size:</b> " + romInfo.size
  romInfoHtml += "<br><b>Checksum:</b> " + romInfo.globalChecksum
  romInfoHtml += "<br><b>Manufacturer:</b> " + romInfo.manufacturer
  $("#rom-info").empty()
  alert(romInfo.rawRom[0x100])
  $("#rom-info").append(romInfoHtml)
}

jgb.FileHandler = function(files){
  var romFile = files[0]
  var supportsFileAPI = window.File && window.FileReader && window.FileList && window.Blob
  if (supportsFileAPI) {
    if (romFile.name.toLowerCase().endsWith(".gb")) {
      var reader = new FileReader();
      reader.onload = function(theFile) {
        var content = theFile.target.result
        var romByteArray = new Uint8Array(content)
        window.emulator = new jgb.Gameboy(romByteArray)
        new jgb.FillInfo()
      }
      reader.readAsArrayBuffer(romFile)
    } else {
      alert("This file isn't a gb.")
    }
  } else {
    alert("The File APIs are not fully supported in this browser.")
  }

}
