// 16 bit machine with word equals to 2B
// little endian arch
var jgb = jgb || {}

jgb.Binary = function(){
  this.wordFrom = function(firstByte, secondByte) {return (secondByte << 8) | firstByte}
  this.firstByteFrom = function(word) {return word >> 8}
  this.secondByteFrom = function(word) {return word & 0x00FF}
  this.toHexa = function(number) {return "0x" + (number).toString(16).toUpperCase()}
  this.toBinary = function(number) {return "0b" + (number).toString(2).toUpperCase()}
}
