
function renderer(width, height, origin, cameraDist, pointCount, makeNewPoints) {

var that=this

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer3 = []
var scene     = []
var camera    = []
 /*stats,*/ 
var particles = []
var attributes= []

var numPoints = pointCount, radius = 7,
    isShiftDown = isMouseActive = false, 
    theta  = onMouseDownTheta   = 45,  
    phi    = onMouseDownPhi     = 60, 
    onMouseDownPosition         = new THREE.Vector2(),
    degRad = Math.PI / 360 



that.applyColorsToAttributes = function(points, view) {
	var values_color = attributes[view].customColor.value;
	var values_size  = attributes[view].size.value;

	for( var v = 0; v < numPoints; v++ ) {
		var color = new THREE.Color( points[v].c.toHex() );
//		console.log(points[v].c.toHex())
		values_color[v] = new THREE.Vector4(color.r, color.g, color.b, points[v].a );
		values_size[v]  = 10
	}
	attributes[view].customColor.needsUpdate = true;
}



that.applyVerticesToGeometry = function(points, view) {
	var geometry = particles[view].geometry
	geometry.vertices.length=0

	for ( var i = 0; i < points.length; i++ ) {
		var vertex = new THREE.Vector3(points[i].x,points[i].y, points[i].z);
		geometry.vertices.push( vertex );
	}
	geometry.verticesNeedUpdate = true;
}



function _init(view) {	
	scene[view]  = new THREE.Scene();
	camera[view] = new THREE.PerspectiveCamera( 40, width / height, 1, 10000 );
	updateCamera(view)

	attributes[view] = {
		size: {	type: 'f', value: [] },
		customColor: { type: 'v4', value: [] }
	};

	var uniforms = {
		amplitude: { type: "f", value: 1.0 },
		color:     { type: "c", value: new THREE.Color( 0xffffff ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "images/particle.png" ) },
	};

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		uniforms,
		attributes:     attributes[view],
		vertexShader:   $('#vertexshader').text(),
		fragmentShader: $('#fragmentshader').text(),

		blending: 		THREE.AdditiveBlending,
		depthTest: 		false,
		transparent:	true
	});

	var geometry = new THREE.Geometry();

	particles[view] = new THREE.ParticleSystem( geometry, shaderMaterial );

	particles[view].dynamic = true;


	that.applyVerticesToGeometry(points, view)
	that.applyColorsToAttributes(points, view)


	scene[view].add( particles[view] );

	renderer3[view] = new THREE.WebGLRenderer();
	renderer3[view].setSize( width, height );
	renderer3[view].setClearColor(0x000000)

	var container = document.getElementById( 'container' );
	container.appendChild( renderer3[view].domElement );

	// stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.top = '0px';
	// container.appendChild( stats.domElement );
}



function onWindowResize() {
	camera[view].aspect = window.innerWidth / window.innerHeight;
	camera[view].updateProjectionMatrix();

	renderer3[view].setSize( window.innerWidth, window.innerHeight );
}



that.resize = function() {
	$(window).resize(onWindowResize);
}


function animate() {
	requestAnimationFrame( animate )

	for (var view=0; view<origin.length; view++) { 
		render(view)
	}
//	stats.update();
}



function onDocumentMouseDown( event ) {

	event.preventDefault();

	isMouseActive = ! isMouseActive;
	var mousePointer = 'auto'
	if (isMouseActive) {
		mousePointer = 'pointer'
	}
	$('#container').css('cursor', mousePointer);

	onMouseDownTheta = theta;
	onMouseDownPhi   = phi;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
}



function onDocumentMouseMove( event ) {
	if ( isMouseActive ) {
		event.preventDefault();
		theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
		phi   =   ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
		if (phi >= 180) {
			phi = 180
			onMouseDownPosition.y+=2
			// phi = -180+(phi-180)
			// cameraDist = -abs(cameraDist)
		} else if (phi <= -180) {
			onMouseDownPosition.y-=2
			phi = -180
		// 	phi = -(-180+(phi-180))
		// 	cameraDist = -abs(cameraDist)
		// } else {
		// 	cameraDist =  abs(cameraDist)
		}

		// console.log(phi)
		// console.log(cameraDist)
		
		for (var view=0; view<origin.length; view++) { 
			updateCamera(view)
		}
//		console.log(camera.position.y)
	}
}



function updateCamera(view) {
		var thetaR = theta * degRad
		var phiRad = phi   * degRad
		var cosPhi = Math.cos( phiRad )
		var sinPhi = Math.sin( phiRad )

		camera[view].position.x = cameraDist * Math.sin( thetaR ) * cosPhi;
		camera[view].position.y = cameraDist * sinPhi; // y acts like z
		camera[view].position.z = cameraDist * Math.cos( thetaR ) * cosPhi;

		//console.log(camera[view].position.x+","+camera[view].position.y+","+camera[view].position.z)

		camera[view].lookAt(origin[view])
		camera[view].updateMatrix();
}



function onDocumentMouseWheel( event ) {
	if ( isMouseActive ) {
		event.preventDefault();
		cameraDist -= event.wheelDeltaY;
		for (var view=0; view<origin.length; view++) { 
			updateCamera(view)
		}
	}
}



function render(view) {
	//var time = Date.now();

	// for( var i = 0; i < attributes[view].size.value.length; i++ ) {
	// 	attributes[view].size.value[ i ] = shell + 10 * Math.sin( 0.1 * i + time * 0.005 ) + 5 * Math.cos(i + time * 0.005);
	// }
	// attributes[view].size.needsUpdate = true;

	renderer3[view].render( scene[view], camera[view] );
}



that.init = function() {
	makeNewPoints()
	$('body').click(onDocumentMouseDown);
	$('body').mousemove(onDocumentMouseMove);
	document.addEventListener('mousewheel', onDocumentMouseWheel, false );

	for (var view=0; view<origin.length; view++) { 
		_init(view)
	}
	animate()
}


return this
}