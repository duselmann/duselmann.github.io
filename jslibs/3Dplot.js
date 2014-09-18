// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js

var cn = 100000
var camera = new Vector([cn,10*cn,cn])

/* 

Converts 3D points [x,y,z] to skewed perspective 2D points [x,y] as below suggests
    z
    .
    .
    .
    . . . . . x
   .  
  .
 .
y

*/
var xyz2xy=function(v) {
	var xy={x:v.x-v.y/3, y:v.y/3-v.z}

	return xy
}



var rotateAboutZ=function(points,theta) {
	for (var p in points) {
		var point = points[p]
		var x = point.x
		var y = point.y
		point.values[0] = x*Math.cos(theta)-y*Math.sin(theta)
		point.values[1] = x*Math.sin(theta)+y*Math.cos(theta)
		point.setXYZ()
	}
}

var rotateAboutX=function(points,theta) {
	for (var p in points) {
		var point = points[p]
		var z = point.z
		var y = point.y
		point.values[2] = z*Math.cos(theta)-y*Math.sin(theta)
		point.values[1] = z*Math.sin(theta)+y*Math.cos(theta)
		point.setXYZ()
	}
}

var rotateAboutY=function(points,theta) {
	for (var p in points) {
		var point = points[p]
		var x = point.x
		var z = point.z
		point.values[0] = x*Math.cos(theta)-z*Math.sin(theta)
		point.values[2] = x*Math.sin(theta)+z*Math.cos(theta)
		point.setXYZ()
	}
}


var sphere = function(radius) {
	var points=[]
	var p=0
	for (var lon=0; lon<pi2; lon+=.2) {
		for (var lat=0; lat<pi2; lat+=.15) {
			points[p++] = { x:sin(lon)*radius*sin(lat), y:sin(lon)*radius*cos(lat), z:radius*cos(lon), a:1 }
		}
	}
	return points
}

var foggySphere = function(radius) {
	var points=[]
	var p=0
	var r=1
	for (var p=0; p<5000; p++) {
		var x=rand()*2*r-r
		var y=rand()*2*r-r
		var z=rand()*2*r-r
		var alpha = r-sqrt(x*x+y*y+z*z)
		points[p] = { x:radius*x, y:radius*y, z:radius*z, a:alpha}
	}
	return points
}


var cube = function(radius) {
	var points=[]
	var p=0
	var r=1
	for (var x=-r; x<r; x+=.2) {
		for (var z=-r; z<r; z+=.2) {
			for (var y=-r; y<r; y+=.15) {
				points[p++] = { x:radius*x, y:radius*y, z:radius*z, a:1 }
			}
		}
	}
	return points
}

var foggyCube=function(radius) {
	var points=cube(radius)

	for (var p in points) {
		var pt = points[p]
		var alpha = 1-sqrt(pt.x*pt.x+pt.y*pt.y+pt.z*pt.z)
		pt.a = alpha
	}

	return points
}

var sortPointsNearFarFromCamera = function(points, camera){
	for (var p in points) {
		var point  = points[p]
		var sort   = -point.dist2(camera)
		point.sort = sort
	}
	
	quickSort(points, "sort")
}

