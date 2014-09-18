var close = function(a,b,d) {
	d = d ?d : 0.000001
	return (a<b+d  &&  a>b-d)
}

var v = new Vector([1,2,3])

if (v.x !== 1 ) {
	alert('expect vector x to be 1 but was ' + v.x)
}
if (v.y !== 2 ) {
	alert('expect vector y to be 2 but was ' + v.y)
}
if (v.z !== 3 ) {
	alert('expect vector z to be 3 but was ' + v.z)
}


var v = new Vector([1,2])

if (v.z !== undefined ) {
	alert('expect vector z to be undefined but was ' + v.z)
}

if (v.get(1) !== 2 ) {
	alert('expect vector y to be 2 but was ' + v.get(1))
}

if (v.values === undefined ) {
	alert('expect vector values to be [1,2] but was undefined')
}

if (v.magSqrd() !== 5 ) {
	alert('expect vector magSqrd to be 5 but was ' + v.magSqrd())
}

var v = new Vector([3,4])

if (v.mag() !== 5 ) {
	alert('expect vector mag to be 5 but was ' + v.mag())
}
if (v.mag() !== v.magnitude() ) {
	alert('expect vector mag and magnitude to be equal but they are not')
}


v.normalize()
if (v.mag() !== 1) {
	alert('expect vector mag to be 1 after normalize but was ' + v.mag())
}


var clone = v.clone()
if (v === clone) {
	alert('expect vector object not equal its clone but was ')
}
if (v.x !== clone.x) {
	alert('expect vector x equal its clone x but was not')
}
if (v.mag() !== clone.mag()) {
	alert('expect vector mag to be equal to its clone mag but was ' + clone.mag())
}


if (v.dotNorm(clone) !== 1) {
	alert('expect dot with clone to be 1 but was ' + v.dotNorm(clone))	
}



var a = new Vector([ 5,1,4])
var b = new Vector([-1,0,2])

var dot = a.dot(b)
if (dot !== 3) {
	alert('expect dot with b to be 3 but was ' + dot)	
}
var dotNorm = a.dotNorm(b)
var dot = a.clone().normalize().dot( b.clone().normalize() )
if (dotNorm !== dot) {
	alert('expect dotNorm to be dot of normalized but was ' + dotNorm)	
}


var cp = a.crossProduct(b)
if (cp.x !== 2 || cp.y !== -14 || cp.z !== 1) {
	alert('expect crossProduct to be [2,-14,1] but is ['+cp.x+','+cp.y+','+cp.z+']')	
}


var det = a.determinant([[1,1,1],a.values,b.values])
if (det !== -11) {
	alert('expect det to be -11 but was ' + det)	
}


var a = new Vector([1,2,3])
var b = new Vector([3,2,1])

a.translate(b)
if (a.x !== 4 || a.y !== 4 || a.z !== 4) {
	alert('expect sum of vectors is [4,4,4] but is ['+cp.x+','+cp.y+','+cp.z+']')
}
a.mult(2)
if (a.x !== 8 || a.y !== 8 || a.z !== 8) {
	alert('expect scalar mult of vector by scalar is [8,8,8] but is ['+cp.x+','+cp.y+','+cp.z+']')
}

var sq3 = Math.sqrt(3)
var v   = new Vector([1,sq3])
var cos = v.cos()
if ( !close(cos, .5) ) {
	alert('expect cos of vector phase 60 degress to be 0.5 but is ' + cos)
}

var v = new Vector([sq3,1])
var sin = v.sin()
if ( !close(sin, .5) ) {
	alert('expect sin of vector phase 30 degress to be 0.5 but is ' + sin)
}

var a = new Vector([1,1])
var b = new Vector([1,3])

var dist = a.dist(b)
if (dist !== 2) {
	alert('expect distance from point a to b to be 2 but was ' + dist)
}
var dist2 = a.dist2(b)
if (dist2 !== 4) {
	alert('expect distance squared from point a to b to be 4 but was ' + dist2)
}

var a = new Vector([1,1])
var b = new Vector([0,3])
var project = a.project(b)
if ( project.mag() * 3 !== b.mag() ) {
	alert('expect the projection of a onto b to be 3 times b mag but is '+ project.mag())
}
if ( b.clone().normalize().dot( project.clone() ) !== 1 ) {
	alert('expect the projection of a onto b to be in line with normalized b but is ['+project.x+','+project.y+']')
}


var me = new Vector([0,0,1])
var a  = new Vector([1,0,0])
var r  = me.rotateDegrees(a, 0.9)
if ( !close(r.x,0) || !close(r.y,-0.01570731) || !close(r.z,.9998766) ) {
	alert('expect rotation of a about b should move from [0,1,0] to [1,0,0] but is ['+r.x+','+r.y+','+r.z+']')
}
var me = new Vector([0,1,0])
var a  = new Vector([1,0,0])
var r  = me.rotateDegrees(a, 90)
if ( !close(r.x,0) || !close(r.y,0) || !close(r.z,1) ) {
	alert('expect rotation of a about b should move from [0,1,0] to [1,0,0] but is ['+r.x+','+r.y+','+r.z+']')
}

var me = new Vector([0,1,0])
var a  = new Vector([1,1,0])
var r  = me.rotateDegrees(a, 180)
if ( !close(r.x,1) || !close(r.y,0) || !close(r.z,0) ) {
	alert('expect rotation of a about b should move from [0,1,0] to [1,0,0] but is ['+r.x+','+r.y+','+r.z+']')
}

var me = new Vector([0,1,0])
var a  = new Vector([1,1,0]).normalize()
var r  = me.rotateDegrees(a, 180)
if ( !close(r.x,1) || !close(r.y,0) || !close(r.z,0) ) {
	alert('expect rotation of a about b should move from [0,1,0] to [1,0,0] but is ['+r.x+','+r.y+','+r.z+']')
}

var me = new Vector([0,1,0])
var a  = new Vector([10,10,0])
var r  = me.rotateDegrees(a, 180)
if ( !close(r.x,1) || !close(r.y,0) || !close(r.z,0) ) {
	alert('expect rotation of a about b should move from [0,1,0] to [1,0,0] but is ['+r.x+','+r.y+','+r.z+']')
}

var me = new Vector([0,1,0])
var a  = new Vector([1,1,1])
var r  = me.rotateDegrees(a, 240)
if ( !close(r.x,1) || !close(r.y,0) || !close(r.z,0) ) {
	alert('expect rotation of a about b should move from [0,1,0] to [1,0,0] but is ['+r.x+','+r.y+','+r.z+']')
}

var me = new Vector([0,1,0])
var a  = new Vector([2,1,0])
var r  = me.rotateDegrees(a, 180)
if ( !close(r.x,.8) || !close(r.y,-.6) || !close(r.z,0) ) {
	alert('expect rotation of a about b should move from [0,1,0] to [1,0,0] but is ['+r.x+','+r.y+','+r.z+']')
}

var me = new Vector([0,1,0])
var a  = new Vector([1,2,0])
var r  = me.rotateDegrees(a, 180)
if ( !close(r.x,.8) || !close(r.y,.6) || !close(r.z,0) ) {
	alert('expect rotation of a about b should move from [0,1,0] to [1,0,0] but is ['+r.x+','+r.y+','+r.z+']')
}
// v.x = 9
// if (v.x !== v.get(0)) {
// 	alert('expect vector x and get(0) to be equal but get(0) was ' + v.get(0))
// }




// ensure full execution of the this script
alert('VectorTests Finished Execution')
