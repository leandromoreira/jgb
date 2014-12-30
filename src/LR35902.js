//### Gameboy cpu
//
//CPU: Custom 8-bit Sharp LR35902 core at 4.19 MHz.
//This processor is similar to an Intel 8080 in that none of the registers introduced in the Z80 are present.
//However, some of the Z80's instruction set enhancements over the stock 8080, particularly bit manipulation,
//are present. Still other instructions are unique to this particular flavor of Z80 CPU.
//The core also contains integrated sound generation.

var jgb = jgb || {}

jgb.LR35902 = function(){
  this.PC = 0x0000
}

