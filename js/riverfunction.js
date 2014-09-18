// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js

//rand = THREE.Math.random16
var mt = new MersenneTwister();
rand = function() {
	return mt.random()
}

var alphaRatio = 1
var maxR   = 0
var fudge  = pi
var points = []
var shell  = 1
var size   = 100
var cameraDist = 1000;
var vr; //viewRenderer



var setupSingleView = function() {
	var WIDTH  = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var COUNT  = 2*5000;
	var origin = [new THREE.Vector3(0,0,0)];
	
	vr = renderer(WIDTH,HEIGHT,origin,cameraDist,COUNT,makeNewRiver)
	vr.init()
	vr.resize()
}



var setupDoubleView = function() {
	var WIDTH  = 400
	var HEIGHT = 300
	var COUNT  = 2500
	var origin = [new THREE.Vector3(-cameraDist/10,0,0),
	              new THREE.Vector3(+cameraDist/10,0,0)]
	
	vr = viewRenderer = renderer(WIDTH,HEIGHT,origin,cameraDist,COUNT,makeNewRiver)
	vr.init()

}



var makeNewRiver = function() {
	    size   = getVal('#size')
	var detail = getVal('#detail')
	var floor  = getVal('#floor') * 10
	var curves = getVal('#curves')

	points = makeRiver(size, detail, floor, curves, colorByMethod)
	return points
}





function changeRiver(points,view) {
	vr.applyVerticesToGeometry(points, view)
	vr.applyColorsToAttributes(points, view)
}




var colorBy = function(by) {
	colorByMethod = eval("colorBy"+by)
	recolorPoints(points, colorByMethod)
}

var colorByElevation=function(pt) {
	var c = fromMagPhi(4, pt.y/4.4 +400)
	var color = complexColor(c)
	return color
}



var colors = [
	new Color( 50, 10,  0), // brown-red
	new Color(100, 50,  0), // orange
	new Color(200,100,  0), // yellow
	new Color(  0,100, 10), // green
	new Color(  0, 50, 50), // cyan
	new Color(  0, 10,200), // blue
]
var colorByElevationIndex=function(pt,y) {
	return colors[y]
}




var colorPoint = function(point, colorer, bias) {
	var color = new Color(0,0,255)
	if (colorer) {
		color = colorer(point, bias)
	}
	point.c = color;
}
var colorPoints = function(points, colorer, bias) {
	for (var p=0;p<points.length;p++) {
		var pt = points[p]
		var b  = bias(pt)
		color  = colorer(pt, b)
		pt.c   = color		
	}
}



var radiusBias = function(pt) {
	var rr = sqrt(pt.x*pt.x + pt.y*pt.y + pt.z*pt.z)
	return Math.acos(pt.z/rr)
}
var zeroBias = function() {
	return 0
}



var recolorPoints = function(points, colorer) {
	colorPoints(points, colorer)
	applyColorsToAttributes(points, 0)
}



var newRiverUI = function() {
	makeNewRiver()
	changeRiver(points,0)
}
var newRiverUI3d = function() {
	makeNewRiver()
	changeRiver(points,0)
	changeRiver(points,1)
}



var getVal = function(el) {
	var val = parseInt( $(el).val() )
	var min = eval( $(el).attr('min') )
	var max = eval( $(el).attr('max') )
	if (val > max) val = max
	if (val < min) val = min
	$(el).val(val)
	return val
}



var makeRiver = function(size, detail, floor, curves, colorer) {

	var x = 1    * size
	var z = 8    * size
	var y = 1.5  * size

	var p1 = new Vector([x,y,z])
	var p2 = new Vector([x,y,-z])

	var blue = new Color(0, 10, 200)

	var points =[]
	points.push(p1)
	points.push(p2)

	var elevation = []
	elevation.push(p1)
	elevation.push(p2)
	makeRandomLine(elevation, detail, p1, p2, floor)

	makeRandomLine(points, detail, p1, p2, curves)
	colorPoints(points, colorer, zeroBias)

	numPoints = points.length

	for (var p=0; p<numPoints; p++) {
		var pt = points[p]

		var np = new Vector([pt.x-2*size,pt.y,pt.z])
		np.a = 1
		colorPoint(np, colorer, 0)
		points.push(np)

		var pnts = [pt,np]

		for (var y=0; y<5; y++) {

			for (var xx=0; xx<pnts.length; xx++) {
				var yp = pnts[xx].y - (size/4)*(y+1)

				var f  = (y/4+1)*(y/4+1)
				var xp = (pt.x+np.x)/2
				xp += abs(pt.x-np.x)/(f+(y==4?10:1)) * (xx?1:-1)
				var pp = new Vector([xp,yp,pt.z])
				pp.a = 1
				colorPoint(pp, colorer, y+1)
				points.push(pp)

				if (y===4) {
					pp.y =  20* (elevation[p].x/elevation[0].x) - size/8
					pp.c = blue
				}
			}
		}
	}
	console.log(points.length)

	while (points.length<100000) {
		var p = new Vector([0,0,0])
		p.c   = new Color(0,0,0)
		p.a   = 0
		points.push(p)
	}

	numPoints = points.length
	console.log(numPoints)
	return points
}



var makeRandomLine = function(points, detail, p1, p2, dp) {

	var dz = (p1.z - p2.z) / 2

	var ax = (p1.x + p2.x) / 2      // ave x
	var y  = p1.y
	var az = (p1.z + p2.z) / 2      // ave z
	var nx = (rand()*2-1) * dp + ax // new x

	var point = new Vector([nx,y,az])
	points.push(point)

	point.a = 1

	dp /= 2

	if (dz > detail) {
		makeRandomLine(points, detail, p1, point, dp)
		makeRandomLine(points, detail, point, p2, dp)
	}

	return points
}



var makeLineRiver = function(maxPoints, size, colorer) {

	numPoints = maxPoints

	var tracePoints = maxPoints/8

	var points=[]
	while (points.length<maxPoints) {

		var x = -size/4
		for (var z=-8*size; z<8*size; z+= 16*size/tracePoints) {
			for (var y=4; y>0; y--) {
				var xp = x * y
				var yp = y * size/2 - size/2

				for (var xx=1; xx>=-1; xx-=2) {
					var p = new Vector([xp*xx,yp,z])
					p.a = 1
					colorPoint(p, colorer, 1)
					points.push(p)
				}
			}
		}
	}
	return points
}



var magnitude = function(pt) {
	return sqrt(pt.x*pt.x + pt.y*pt.y + pt.z*pt.z)
}

var colorByMethod = colorByElevationIndex

