// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js


// color manager - tohex
var Color = Class.extend({
  init: function(r,g,b) {
    this.red   = this.r = Math.floor(Math.min(255,Math.max(0,r)))
    this.green = this.g = Math.floor(Math.min(255,Math.max(0,g)))
    this.blue  = this.b = Math.floor(Math.min(255,Math.max(0,b)))
    this.dec   = r*65536 +g*256 +b
    this.hex   = undefined
  },

  toHex: function() {
    if (this.hex) {
      return this.hex
    }
    var rStr = this._padHex( this.red.toString(16) )
    var gStr = this._padHex( this.green.toString(16) )
    var bStr = this._padHex( this.blue.toString(16) )
    this.hex = ('#' + rStr + gStr + bStr).toUpperCase()
    return this.hex
  },

  equal: function(color) {
    return color.dec === this.dec
//    return color.r === this.r && color.g == this.g && color.b == 
  },

  _padHex: function(hex) {
    if (hex.length == 1) {
      return '0' + hex
    }
    return hex
  }
})
