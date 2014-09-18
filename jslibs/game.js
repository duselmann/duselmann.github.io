// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js

var canvas = document.getElementById('viewport')
var ctx    = canvas.getContext('2d')

var buffer    = document.createElement('canvas')
buffer.width  = canvas.width
buffer.height = canvas.height
var buf       = buffer.getContext('2d')

function gameLoop() {
	processInput()
	updateState()
	drawSceen()
	setTimeout(gameLoop, 25)
}

function drawSceen() {
	draw(buf)
	flush(buf,ctx)
}

function draw(ctx) {

}

function flush(source,target) {
	target.drawImage(buffer,0,0)
}

