jQuery.fn.cssNumber = function(prop){
    var v = parseInt(this.css(prop),10);
    return isNaN(v) ? 0 : v;
}

var uiMove
var ctx
var canvas


$(function(){

	$('#ui').mousedown(startMoveUI)
	$('#ui').mouseup(stopMoveUI)

	canvas = document.getElementById('ui')
	ctx    = canvas.getContext('2d')
	var borderColor = new Color(100,200,255)
	gradiantBorder(ctx, borderColor, 5)
})


var gradiantBorder = function(ctx, color, thickness) {
	ctx.strokeStyle = color.toHex()
	ctx.lineWidth   = 1
	for (var i=1; i<thickness; i++) {
//		var alpha = 255/thickness*i
//		var c = "rgba("+color.r+","+color.g+","+color.b+","+alpha+" )"
		var t = i
		var l = i
		var w = canvas.width  - 2*i
		var h = canvas.height - 2*i
		ctx.strokeRect(t,l,w,h)
	}
	ctx.globalAlpha = .6
}





// move ui window
var startMoveUI = function(e) {
	uiMove = e
	$('#ui').mousemove(moveUI)
	$('#ui').css('cursor', 'move')
	return false;
}
var stopMoveUI = function(e) {
	$('#ui').unbind('mousemove')
	$('#ui').css('cursor', 'auto')
	return false;
}
var moveUI = function(e) {
	var dx = e.clientX - uiMove.clientX
	var dy = e.clientY - uiMove.clientY
	uiMove = e
	var left = 	$('#ui').cssNumber('left') + dx
	var top = 	$('#ui').cssNumber('top') + dy

	$('#ui').css('top',  top)
	$('#ui').css('left', left)
	return false;
}