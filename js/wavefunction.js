// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js

//rand = THREE.Math.random16
var mt = new MersenneTwister();
rand = function() {
	return mt.random()
}

// quantum numbers
var hb

var n  // 1, 2, 3, 4,
var l  // 0, 1, 2, 3, (s, p, d, f)
var ml // -l <= ml <= l
var ms // +-0.5

var k=w=1

// wave function
var Psi = function(x,t) {
	// a * exp(i*(k*x -w*t)
	// z = r (cos phi + i sin phi)
	var phi = k*x-w*t
	var psi = new Complex( cos(phi), sin(phi) )
	return psi
}

//-hbar*hbar/2m * d2_dx2 * psi(x,t) + U(x) psi(x,t) = i * hbar * d_dt * psi(x,t)


//var xoff    = 400
//var yoff    = 250
//var spinRate= 0.03
//var backcolor = 'black'
//var cycleProbability = false
var rotateY = false
var rotateX = false
var rotateZ = false
var alphaRatio = 1
var maxR = 0
var fudge = pi
//var probabilityClamp = 0.05
var points = []
var shell = 1

function currentOrbital(numPoints) {
	var orbital = window.location.hash.substring(1) + "("+numPoints+","+radius+")"
	return orbital	
}


function renderOrbital() {
	var orbital = currentOrbital(numPoints)
	points = eval(orbital)
	return points
}
function renderMore() {
	var orbital = currentOrbital(50000)
	var newpoints = eval(orbital)
	points.push.apply(points,newpoints)
	particles = makeParticleSystem(points,particles)
}

function changeOrbital() {
	renderOrbital()
	applyVerticesToGeometry(points, particles.geometry)
	applyColorsToAttributes(points, attributes)
}


var transformAll = function(points, radius, probability) {
	for (var p in points) {
		var pt = points[p]
		pt.a = probability(pt)
		pt.mult(radius)
	}
}

var colorBy = function(by) {
	colorByMethod = eval("colorBy"+by)
	recolorPoints(points, colorByMethod)
}

var colorByProbability=function(pt, bias) {
	var c = fromMagPhi(4 * pt.a, 4)
	var color = complexColor(c)
	return color
}

var colorByAngle=function(pt, theta) {
	var c = fromMagPhi(4,theta*2-fudge)
	var color = complexColor(c)
	return color
}
var colorByRadius=function(pt, bias) {
	var rr = sqrt(pt.x*pt.x + pt.y*pt.y + pt.z*pt.z)
	var c = fromMagPhi(4, rr/50)
	var color = complexColor(c)
	return color
}
var colorPoint = function(point, colorer, bias) {
	var color = new Color(0,0,255)
	if (colorer) {
		color = colorer(point, bias)
	}
	point.c = color;
}
var recolorPoints = function(points, colorer) {
	for (var p=0;p<points.length;p++) {
		var pt = points[p]
		var rr = sqrt(pt.x*pt.x + pt.y*pt.y + pt.z*pt.z)
		color  = colorer(pt, Math.acos(pt.z/rr))
		pt.c   = color		
	}
	applyColorsToAttributes(points, attributes)
}



var orbital = function(maxpoints, radius, colorer, probability) {
	shell=radius/7

	var points=[]
	var p=0
	var r=radius
	var maxalpha = -100
	while (p<maxpoints) { 

/*
// asdf try radius theta and phi
		var polar = {
			phi   : rand() * pi2*1.005,
			theta : rand() * pi, //*0.98 + 0.03,
			r     : rand() * radius,
		}
		var xyz = new Vector().fromPolar(polar)


		var x = xyz.x //(rand()*2-1) * r *rand()
		var y = xyz.y //(rand()*2-1) * r *rand()
		var z = xyz.z //(rand()*2-1) * r *rand()

		// rand correction factor - not perfect but prettey good
		var small = x*x+y*y;
		if (rand()>0.02*small && rand()>0.04) continue; 
*/

		var x = (rand()*2-1) * r
		var y = (rand()*2-1) * r
		var z = (rand()*2-1) * r
		points[p] = new Vector([x,y,z])


		var rr = sqrt(x*x + y*y + z*z)
		var tmp = maxR
		maxR = max(rr, maxR)
		if (tmp !== maxR) console.log("max radius: " + maxR)


		var alpha 
		if (probability) {
			alpha = probability(points[p])
		} else {
			alpha = exp(-rr)/.5
		}
		if (alpha <= 0.1 || alpha<rand()) {
			continue; // more priority on high probability
		}
		tmp = maxalpha
		maxalpha = max(alpha,maxalpha)
		if (tmp !== maxalpha) console.log("max alpha: " + maxalpha)
		points[p].a = alpha


		colorPoint(points[p++], colorer, Math.acos(z/rr))
	}
	transformAll(points, radius, function(pt) {
		return pt.a / maxalpha * alphaRatio
	})

	console.log('normalize max alpha: ' + alphaRatio)
	console.log('done computing points: ' + maxpoints)
	return points
}

var magnitude = function(pt) {
	return sqrt(pt.x*pt.x + pt.y*pt.y + pt.z*pt.z)
}

var orbital100 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints,  radius, colorByMethod, function(pt){
		var r = magnitude(pt)
		var alpha = 2*abs(exp(-r))
		return alpha
	})
}

var orbital200 = function(maxpoints, radius) {
	alphaRatio = 1
	return orbital(maxpoints,  2*radius, colorByMethod, function(pt){
		var r = magnitude(pt)
		var alpha = abs( exp(-r/2) * (2-r) / 4 / sqrt(pi2) ) /.11
		return alpha
	})
}
var orbital210 = function(maxpoints, radius) {
	alphaRatio = .75
	return orbital(maxpoints,  2*radius, colorByMethod, function(pt){
		var Z = 1
		var n = 2
		var r = magnitude(pt)
		var rho = 2*Z*r/n
		var c = sqrt(3)/r * sqrt(pi/4)

		var plusMinus = rand()>.5?1:-1

		var radial = rho * pow(Z,3/2) * exp(-rho/2)
		var angular= sqrt(3)*pt.z/r * sqrt(pi/4)
		var alpha  = plusMinus * radial * angular
		return alpha
	})
}

var orbital211 = function(maxpoints, radius) { // ? 211
	alphaRatio = .75
	return orbital(maxpoints, 2*radius, colorByMethod, function(pt){
		var Z = 1
		var n = 2
		var r = magnitude(pt)
		var rho = 2*Z*r/n
		var c = sqrt(3)/r * sqrt(pi/4)

		var plusMinus = rand()>.5?1:-1

		var radial = rho * pow(Z,3/2) * exp(-rho/2)
		var angular= sqrt(3)*pt.x/r * sqrt(pi/4)
		var alpha  = plusMinus * radial * angular
		return alpha
	})
}


var orbital300 = function(maxpoints, radius) {
	alphaRatio = 1.5
	return orbital(maxpoints, 3*radius, colorByMethod, function(pt){
		var r = magnitude(pt)
		var alpha = abs( exp(-r/3) * (27-18*r+2*r*r) ) / 7
		return alpha
	})
}

var orbital310 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints, 3*radius, colorByMethod, function(pt){
		var r = magnitude(pt)
		var costheta = pt.z/r
		var alpha = abs( exp(-r/3) * r*r  * costheta ) / 7
		return alpha
	})
}

var orbital311 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints, 3*radius, colorByMethod, function(pt){
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var r   = sqrt(rr2)
		var costheta = pt.z/r
		var sintheta = sqrt(xy2)/r

		var plusMinus = rand()
		var eiphi =  (plusMinus>.5?1:-1)*(pt.x+pt.y) / sqrt(xy2)

		var alpha = abs( exp(-r/3) * r*r * sintheta ) * eiphi / 7
		return alpha
	})
}

var orbital320 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints, 3*radius, colorByMethod, function(pt){
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var rr  = sqrt(rr2)
		var costheta = pt.z/rr

		var alpha = abs( exp(-rr/3) * rr*rr * (3*costheta*costheta-1) ) / 20
		return alpha
	})
}
// orbital3dz2 == orbital320



var orbital321 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints,  3*radius, colorByMethod, function(pt){
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var rr  = sqrt(rr2)
		var costheta = pt.z/rr
		var sintheta = sqrt(xy2)/rr

		var plusMinus = rand()
		var eiphi =  (plusMinus>.5?1:-1)*(pt.x+pt.y) / sqrt(xy2)

		var alpha = abs( exp(-rr/3) * rr*rr * sintheta * costheta * eiphi) / 7
		return alpha
	})
}


var orbital322 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints,  3*radius, colorByMethod, function(pt){
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var rr  = sqrt(rr2)
		var costheta = pt.z/rr
		var sintheta = sqrt(xy2)/rr
		var sin2theta = xy2/rr2

		var plusMinus = rand()
		var eiphi =  (plusMinus>.5?1:-1)*(pt.x+pt.y) / sqrt(xy2)

		var alpha = abs( exp(-rr/3) * rr*rr * sin2theta * eiphi*eiphi) / 40
		return alpha
	})
}


var orbital400 = function(maxpoints, radius) {
	alphaRatio = 15
	return orbital(maxpoints,  3.3*radius, colorByMethod, function(pt){
		var Z = 1
		var n = 2
		var r = magnitude(pt)
		var rho = 2*Z*r/n
		var c = sqrt(pi/4)

		var radial = (24 - 36*rho + 12*pow(rho,2) - pow(rho,3)) *10// 96 
			* pow(Z,3/2) * exp(-rho/2)
		var angular= c
		var alpha  = radial * angular
		return alpha * alpha
	})
}



var orbital411 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints,  2.5*radius, colorByMethod, function(pt){
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var rr  = sqrt(rr2)
		var costheta = pt.z/rr
		var sintheta = sqrt(xy2)/rr
		var sin2theta = xy2/rr2

		var plusMinus = rand()
		var eiphi =  (plusMinus>.5?1:-1)*(pt.x+pt.y) / sqrt(xy2)

		var alpha = abs( exp(-rr/4) * rr*rr  * pow(sintheta,3) * pow(eiphi,3) ) / 50
		return alpha
	})
}



var orbital420 = function(maxpoints, radius) {
	alphaRatio = 3
	return orbital(maxpoints, 2*radius, colorByMethod, function(pt){
		var Z   = 2
		var n   = 4
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var r   = sqrt(rr2)
		var rho = 2*Z*r/n

		var plusMinus = rand()>.5?1:-1
//		var eiphi     = plusMinus *(pt.x+pt.y) / sqrt(xy2)

		var radialBase= (6-rho)*rho*rho*exp(-rho/2)*pow(4,3/2) // sqrt(5)/96
		var radial    = r*r*radialBase*radialBase
		var angular   = (2*pt.z*pt.z-xy2) / r/r * sqrt(pi/4) * radialBase

		var alpha     = radial * angular * 50

		return alpha * alpha
	})
}


var orbital421 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints, 2*radius, colorByMethod, function(pt){
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var rr  = sqrt(rr2)
		var costheta = pt.z/rr
		var sintheta = sqrt(xy2)/rr
		var sin2theta = xy2/rr2

		var plusMinus = rand()
		var eiphi =  (plusMinus>.5?1:-1)*(pt.x+pt.y) / sqrt(xy2)

		var alpha = abs( exp(-rr/4) * rr*rr * pow(sintheta,2) * costheta * pow(eiphi,2) ) / 20
		return alpha
	})
}

var orbital430 = function(maxpoints, radius) {
	alphaRatio = 1/2
	return orbital(maxpoints, 3*radius, colorByMethod, function(pt){
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var rr  = sqrt(rr2)
		var costheta = pt.z/rr
		var sintheta = sqrt(xy2)/rr
		var sin2theta = xy2/rr2

		var plusMinus = rand()
		var eiphi =  (plusMinus>.5?1:-1)*(pt.x+pt.y) / sqrt(xy2)

		var alpha = abs( exp(-rr/4) * rr*rr  * (5*pow(costheta,3)-3*costheta) ) / 50
		return alpha
	})
}

var orbital431 = function(maxpoints, radius) {
	alphaRatio = 1
	return orbital(maxpoints, 2.5*radius, colorByMethod, function(pt){
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var rr  = sqrt(rr2)
		var costheta = pt.z/rr
		var sintheta = sqrt(xy2)/rr
		var sin2theta = xy2/rr2

		var plusMinus = rand()
		var eiphi =  (plusMinus>.5?1:-1)*(pt.x+pt.y) / sqrt(xy2)

		var alpha = abs( exp(-rr/4) * rr*rr  *eiphi*sintheta* (5*costheta*costheta-1) ) / 50
		return alpha
	})
}


var orbital520 = function(maxpoints, radius) {
	alphaRatio = 5
	return orbital(maxpoints, 3.3*radius, colorByMethod, function(pt){
		var Z   = 2
		var n   = 5
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var r   = sqrt(rr2)
		var rho = 2*Z*r/n

		var plusMinus = rand()>.5?1:-1
//		var eiphi     = plusMinus *(pt.x+pt.y) / sqrt(xy2)

		var radialBase= (42-14*rho+rho*rho)*rho*rho*exp(-rho/2)*pow(4,3/2) // sqrt(70)/150
		var radial    = r*r*radialBase*radialBase
		var angular   = (2*pt.z*pt.z-xy2) / r/r * sqrt(pi/4) * radialBase

		var alpha     = radial * angular * 50

		return alpha * alpha
	})
}





// (1/2160√6) × (720 - 1800ρ + 1200ρ2 - 300ρ3 + 30ρ4 - ρ5) × Z3/2 × e-ρ/2

var orbital600 = function(maxpoints, radius) {
	alphaRatio = 20
	return orbital(maxpoints,  4.5*radius, colorByMethod, function(pt){
		var Z = 2
		var n = 6
		var r = magnitude(pt)
		var rho = 2*Z*r/n
		var c = sqrt(pi/4)

		var radial = (1/2160/sqrt(6)) * (720 - 1800*rho +1200*rho*rho -300*pow(rho,3) +30*pow(rho,4) -pow(rho,5) ) * pow(Z,3/2) * exp(-rho/2)
		var angular= c
		var alpha  = radial * angular * 50
		return alpha*alpha
	})
}



var orbital620 = function(maxpoints, radius) {
	alphaRatio = 3
	return orbital(maxpoints, 5*radius, colorByMethod, function(pt){
		var Z   = 2
		var n   = 6
		var xy2 = pt.x*pt.x + pt.y*pt.y
		var rr2 = xy2 + pt.z*pt.z
		var r   = sqrt(rr2)
		var rho = 2*Z*r/n

		var plusMinus = rand()>.5?1:-1
//		var eiphi     = plusMinus *(pt.x+pt.y) / sqrt(xy2)

		var radialBase= (336-168*rho+24*rho*rho-pow(rho,3))*rho*rho*exp(-rho/2)*pow(4,3/2) // sqrt(150)/864
		var radial    = r*r*radialBase*radialBase
		var angular   = (2*pt.z*pt.z-xy2) / r/r * sqrt(pi/4) * radialBase

		var alpha     = radial * angular * 50

		return alpha * alpha
	})
}



// (1/300√70) × (8 - ρ)ρ3 × Z3/2 × e-ρ/2
//√(7/4) × z(5z2 - 3r2)/r3 × (1/4π)1/2
var orbital630 = function(maxpoints, radius) {
	alphaRatio = 1
	return orbital(maxpoints, 4.75*radius, colorByMethod, function(pt){
		var Z = 2
		var n = 6
		var r = magnitude(pt)
		var rho = 2*Z*r/n
		var c = sqrt(3)/r * sqrt(pi/4)

		var plusMinus = rand()>.5?1:-1
		var z = pt.z
		var radial = (1/300/sqrt(70)) * (8-rho)*pow(rho,3) * pow(Z,3/2) * exp(-rho/2)
		var angular= sqrt(5/4)*z*(5*z*z-3*r*r)/pow(r,3) * sqrt(pi/4)/2
		var alpha  = plusMinus * radial * angular
		return alpha*30
	})
}
var orbital640 = function(maxpoints, radius) {
	alphaRatio = 1
	return orbital(maxpoints, 4.75*radius, colorByMethod, function(pt){
		var Z = 2
		var n = 6
		var r = magnitude(pt)
		var rho = 2*Z*r/n
		var c = sqrt(3)/r * sqrt(pi/4)

		var plusMinus = rand()>.5?1:-1
		var z = pt.z
		var radial = (1/900/sqrt(70)) * (8-rho)*pow(rho,4) * pow(Z,3/2) * exp(-rho/2)
		var angular= .1*sqrt(5/4)*(35*pow(z,4)-30*z*z*r*r+3*pow(r,4))/pow(r,4) * sqrt(pi/4)/2
		var alpha  = plusMinus * radial * angular
		return alpha*20
	})
}
//(1/900√70) × (8 - ρ)ρ4 × Z3/2 × e-ρ/2
// k × (35z4 - 30z2r2 + 3r4)/r4 × (1/4π)1/2


//k × xz(4z2 - 3x2 - 3y2)/r4 × (1/4π)1/2
var orbital641 = function(maxpoints, radius) {
	alphaRatio = .75
	return orbital(maxpoints, 4.75*radius, colorByMethod, function(pt){
		var Z = 2
		var n = 6
		var r = magnitude(pt)
		var rho = 2*Z*r/n
		var c = sqrt(3)/r * sqrt(pi/4)

		var plusMinus = rand()>.5?1:-1
		var x = pt.x
		var y = pt.y
		var z = pt.z
		var radial = (1/900/sqrt(70)) * (8-rho)*pow(rho,4) * pow(Z,3/2) * exp(-rho/2)
		var angular= sqrt(5/4)*sqrt(pi/4)/2 * x*z*(4*z*z-3*x*x-3*y*y)/pow(r,4)
		var alpha  = plusMinus * radial * angular
		return alpha*20
	})
}


var colorByMethod = colorByProbability


//http://mathworld.wolfram.com/SphericalHarmonic.html?affilliate=1
//http://winter.group.shef.ac.uk/orbitron/AOs/4d/equations.html
