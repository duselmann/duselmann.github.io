// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js

var CanvasManager = function(canvasElementName, width, height){

	this.canvasName    = !canvasElementName ? "canvas" : canvasElementName
	this.needNewCanvas = true
	this.canvas  = undefined
	this.context = undefined
	this.buffer  = undefined
	this.btx     = undefined
	this.wSet    = width!==undefined
	this.hSet    = height!==undefined
	this.width   = width  ? width  : 0
	this.height  = height ? height : 0
	this.background = "white"


	this.initCanvas = function() {
		if (!this.needNewCanvas) return

		this.needNewCanvas = false
		var oldCanvas = document.getElementById(this.canvasName)
		if (oldCanvas) {
			oldCanvas.parentNode.removeChild(oldCanvas)
		}

		if (!this.wSet) {
			this.width   = window.innerWidth-20
		}
		if (!this.hSet) {
			this.height  = window.innerHeight-20
		}
		this.centerX = this.width/2
		this.centerY = this.height/2

	    this.canvas = document.createElement("canvas")
	    this.canvas.setAttribute("id",     this.canvasName)
	    this.canvas.setAttribute("width",  this.width)
	    this.canvas.setAttribute("height", this.height)
	    //this.canvas.setAttribute("style" , "position: absolute; x:0; y:0;")
		this.context = this.canvas.getContext('2d')

		this.buffer = document.createElement('canvas')
		this.buffer.width  = this.width
		this.buffer.height = this.height
		this.btx = this.buffer.getContext('2d')
		
	    document.body.appendChild(this.canvas)
	}

	this.setNeedNewCanvas = function() {
		this.needNewCanvas = true
	}
	this.isNeedNewCanvas = function() {
		return needNewCanvas
	}

	this.ctx = function() {
		return this.btx
	}
	this.render = function() {
		this.context.drawImage(this.buffer,0,0)
		this.clear()
	}
	this.clear  = function() {
		this.btx.fillStyle = this.background
		this.btx.fillRect(0,0,this.width,this.height)
	}

	this.initCanvas()
 }

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y,   x+w, y+h, r);
	this.arcTo(x+w, y+h, x,   y+h, r);
	this.arcTo(x,   y+h, x,   y,   r);
	this.arcTo(x,   y,   x+w, y,   r);
	this.closePath();
	return this;
}

// CanvasRenderingContext2D.prototype.fillRoundRect = function (x, y, w, h, r) {
// 	if (w < 2 * r) r = w / 2;
// 	if (h < 2 * r) r = h / 2;
// 	this.arc(bod.x/distScale+x0, bod.y/distScale+y0, 5*bod.r,0, 2*Math.PI, true)
// 	this.arcTo(x+w, y,   x+w, y+h, r);
// 	this.arcTo(x+w, y+h, x,   y+h, r);
// 	this.arcTo(x,   y+h, x,   y,   r);
// 	this.arcTo(x,   y,   x+w, y,   r);
// 	this.fill()
// 	return this;
// }
