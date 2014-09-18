// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js

var RADIANS_PER_DEGREE = Math.PI / 180

var Vector = Class.extend({
	init: function(values) {

		if (!values) return undefined

		if (values.r) {
			values = this.fromPolar(values)
		}

		this.values = values
		this.setXYZ()
	},
	degreesToRadians: function(degrees) {
		return degrees * RADIANS_PER_DEGREE
	},
	fromPolar: function(values) {
		var mag = values.r
		var phi = values.phase || values.phi
		var xyz = {x:mag*Math.cos(phi), y:mag*Math.sin(phi)}
		if ( isDefined(values.theta) ) {
			xyz.x *= Math.sin(values.theta)
			xyz.y *= Math.sin(values.theta)
			xyz.z = mag * Math.cos(values.theta)
		}
		return xyz
	},
	clone: function() {
		var values = []
		for (var v=0; v<this.values.length; v++) {
			values[v] = this.get(v)
		}
		return new Vector(values)
	},
	setXYZ: function() {
		var values = this.values
		this.x = values[0]
		this.y = values[1]
		if (values.length>2) {
			this.z = values[2]
		}
		return this
	},
	get: function(idx) {
		var val = this.values[idx]
		return val
	},
	mag2: function() {
		var mag2 = 0
		for (var v=0; v<this.values.length; v++) {
			mag2 += Math.pow(this.get(v), 2)
		}
		return mag2
	},
	magSqrd: function() {
		return this.mag2()
	},
	mag: function() {
		return Math.sqrt(this.magSqrd())
	},
	magnitude: function() {
		return this.mag()
	},
	norm: function() {
		var mag = this.mag()
		for (var v=0; v<this.values.length; v++) {
			this.values[v] /= mag
		}
		return this.setXYZ()
	},
	normalize: function() {
		return this.norm()
	},
	dot: function(b) {
		var dot = 0
		var a = this
		if (this.values.length === b.values.length) {
			for (var v=0; v<this.values.length; v++) {
				dot += a.get(v) * b.get(v)
			}
		}
		return dot
	},
	dotNorm: function(b) {
		var a = this.clone().normalize()
		b = b.clone().normalize()
		return a.dot(b)
	},
	dotProduct: function(b) {
		return this.dot(b)
	},
	cross: function(b) {
		var base   = []
		for (var v=0; v<this.values.length; v++) {
			base[v] = 1
		}
		var matrix = [[1,1,1], this.values, b.values]
		return this.determinant(matrix, true)
	},
	crossProduct: function(b) {
		return this.cross(b)
	},
	determinant: function(matrix, isCrossProduct) {
   		var det = 0
   		var m   = []
   		var ijk = []

   		var n = matrix.length

		if (n == 1) { // det of 1x1 is itself
	        det = matrix[0][0]
	    } else if (n == 2) { // base 2x2 determinant
	        det = matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]
	    } else {
	        det = 0

	        for (var outerCol=0; outerCol<n; outerCol++) {

	         	for (row=1; row<n; row++) {
	            	m[row-1] = []
            		var newCol = 0
            		for (var innerCol=0; innerCol<n; innerCol++) {
               			if (innerCol == outerCol) continue
               			m[row-1][newCol++] = matrix[row][innerCol]
            		}
         		}
         		var outer = matrix[0][outerCol]

         		isCrossProduct &= outer === 1
	            ijk[outerCol] = Math.pow(-1, outerCol+2) * outer * this.determinant(m)
	            det += ijk[outerCol]
	      	}
	    }
	    if (isCrossProduct) {
	    	return new Vector(ijk)
	    }
	    return det
	},
	add: function(s) {
		var a = this
		for (var v=0; v<this.values.length; v++) {
			a.values[v] += s
		}
		return this.setXYZ()
	},
	translate: function(b) {
		var a = this
		for (var v=0; v<this.values.length; v++) {
			a.values[v] += b.values[v]
		}
		return this.setXYZ()
	},
	multiply: function(s) {
		return this.mult(s)
	},
	mult: function(s) {
		var a = this
		for (var v=0; v<this.values.length; v++) {
			a.values[v] *= s
		}
		return this.setXYZ()
	},
	sin: function() {
		var a = this
		var sin
		if (a.values.length === 2) {
			sin = a.y / a.mag()
		}
		return sin
	},
	cos: function() {
		var a = this
		var cos
		if (a.values.length === 2) {
			cos = a.x / a.mag()
		}
		return cos
	},
	tan: function() {
		var a = this
		var tan
		if (a.x && a.values.length === 2) {
			tan = a.y / a.x
		}
		return tan
	},
	project: function(b) {
		var scalar = this.projectScalar(b)
		var v = b.clone().normalize().mult(scalar)
		return v
	},
	projectScalar: function(b) {
		b = b.clone().normalize()
		var project = this.dot(b)
		return project
	},
	dist2: function(b) {
		var a = this.clone()
		a.translate( b.clone().mult(-1) )
		return a.mag2() 
	},
	dist: function(b) {
		var a = this.clone()
		a.translate( b.clone().mult(-1) )
		return a.mag()
	},
	distance: function(b) {
		return a.dist()
	},
	rotateDegrees: function(about, degrees) {
		return this.rotate(about, degrees * RADIANS_PER_DEGREE)
	},
	rotate: function(about, theta) {
		var p = this
		var a = about.clone().normalize()

        var sinTh  = Math.sin(theta)
        var cosTh  = Math.cos(theta)
        var dotCos = this.dot(a) * (1 - cosTh)

        var r = [];
        r[0]  = a.x*dotCos + p.x*cosTh + (a.y*p.z - a.z*p.y)*sinTh
        r[1]  = a.y*dotCos + p.y*cosTh + (a.z*p.x - a.x*p.z)*sinTh
        r[2]  = a.z*dotCos + p.z*cosTh + (a.x*p.y - a.y*p.x)*sinTh

        return new Vector(r);
    },
    polar: function() {
    	var mag   = this.mag()
    	var phase = Math.asin(this.sin())
    	return {r:mag, phi:phase}
    },


})
/* 3d rotations
     +-           -+     +-            -+     +-            -+
     | cosT sinT 0 |     | 1   0    0   |     | cosT 0 -sinT |
     |-sinT cosT 0 |     | 0  cosT sinT |     |  0   1   0   |
     |  0    0   1 |     | 0 -sinT cosT |     | sinT 0  cosT |
     +-           -+     +-            -+     +-            -+


// 4d rotations
     +-             -+     +-              -+     +-              -+
     | cosT sinT 0 0 |     | 1   0    0   0 |     | cosT 0 -sinT 0 |
     |-sinT cosT 0 0 |     | 0  cosT sinT 0 |     |  0   1   0   0 |
     |  0    0   1 0 |     | 0 -sinT cosT 0 |     | sinT 0  cosT 0 |
     |  0    0   0 1 |     | 0   0    0   1 |     |  0   0   0   1 |
     +-             -+     +-              -+     +-              -+
         XY Plane               YZ Plane                ZX Plane


     +-             -+     +-              -+     +-              -+
     | cosT 0 0 sinT |     | 1  0   0   0   |     | 1 0  0     0   |
     |  0   1 0  0   |     | 0 cosT 0 -sinT |     | 0 1  0     0   |
     |  0   0 1  0   |     | 0  0   1   0   |     | 0 0 cosT -sinT |
     |-sinT 0 0 cosT |     | 0 sinT 0  cosT |     | 0 0 sinT  cosT |
     +-             -+     +-              -+     +-              -+
         XW Plane               YW Plane                ZW Plane
*/

