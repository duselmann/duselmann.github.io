// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js

var Complex=function(r,i) {
	this.r = r
	this.i = i

	this.add=function(c) {
		this.r += c.r
		this.i += c.i
		return this
	}
	this.sub=function(c) {
		this.r -= c.r
		this.i -= c.i
		return this
	}
	this.multScalar=function(s) {
		this.r *= s
		this.i *= s
		return this
	}
	this.divScalar=function(s) {
		this.r /= s
		this.i /= s
		return this
	}
	this.mult=function(c) {
		if ( Number(c) ) {
			return this.multScalar(c)
		}
//		r*r - i*i
		var newr = this.r*c.r - this.i*c.i
//		ir + ir
		this.i = this.r*c.i + this.i*c.r
		this.r = newr
		return this
	}
	this.div=function(c) {
		if ( Number(c) ) {
			return this.divScalar(c)
		}
		var cong = c.congigate()
		c.mult(cong)
		this.mult(cong)
		this.divScalar(c.r)
		return this
	}
	this.congigate = function() {
		return new Complex(r,-i)
	}
	this.mag2=function() {
		return this.r*this.r + this.i*this.i
	}
	this.mag=function() {
		return sqrt(this.mag2())
	}
	this.phi=function() {
		return atan(this.i,this.r)
	}
	this.equal=function(c) {
		return this.r==c.r && this.i==c.i
	}
}
function fromMagPhi(mag,phi) {
	return new Complex(mag*cos(phi), mag*sin(phi))
}
function complexColor(c) {
	var mag = c.mag()
	var phi = c.phi()

	mag = ((mag>1) ? 1 : (mag<0) ? 0 : mag) * 255

	while (phi<0) {
		phi+=pi2
	}
	while (phi>=pi2) {
		phi-=pi2
	}

	phi *= 6/pi2
	var range = Math.floor(phi)
	range = min(5,max(0,range))
	var part  = phi - range
	var r,g,b
	r=g=b=0

	switch(range) {
		case 0: r=1;g=part;break;
		case 1: r=1-part;g=1;break;
		case 2: g=1;b=part;break;
		case 3: g=1-part;b=1;break;
		case 4: r=part;b=1;break;
		case 5: r=1;b=1-part;break;
	}

	r *= mag
	g *= mag
	b *= mag

	return new Color(r,g,b)
}
