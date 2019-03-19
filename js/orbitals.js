
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer, scene, camera, stats, particles, uniforms, attributes;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

var cameraDist = 900, numPoints = 2*50000, radius = 7,
	isShiftDown = isMouseActive = false, 
    theta  = onMouseDownTheta   = 45,  
	phi    = onMouseDownPhi     = 60, 
    origin = new THREE.Vector3(0,0,0),
	onMouseDownPosition         = new THREE.Vector2()



function applyColorsToAttributes(points, attributes) {
	var values_color = attributes.customColor.value;
	var values_size  = attributes.size.value;

	for( var v = 0; v < numPoints; v++ ) {
		var color = new THREE.Color( points[v].c.toHex() );
//		console.log(points[v].c.toHex())
		values_color[v] = new THREE.Vector4(color.r, color.g, color.b, points[v].a );
		values_size[v]  = 10
	}
	attributes.customColor.needsUpdate = true;
}



function applyVerticesToGeometry(points, geometry) {
	geometry.vertices.length=0

	for ( var i = 0; i < points.length; i++ ) {
		var vertex = new THREE.Vector3(points[i].x,points[i].z, points[i].y);
		geometry.vertices.push( vertex );
	}
	geometry.verticesNeedUpdate = true;
}



function init() {
	scene  = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 10000 );
	updateCamera()

	attributes = {
		size: {	type: 'f', value: [] },
		customColor: { type: 'v4', value: [] }
	};

	uniforms = {
		amplitude: { type: "f", value: 1.0 },
		color:     { type: "c", value: new THREE.Color( 0xffffff ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "images/particle.png" ) },
	};

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		uniforms,
		attributes:     attributes,
		vertexShader:   $('#vertexshader').text(),
		fragmentShader: $('#fragmentshader').text(),

		blending: 		THREE.AdditiveBlending,
		depthTest: 		false,
		transparent:	true
	});


	if ( window.location.hash.indexOf('#orbital') < 0 ) {
		window.location.hash='orbital100'
	}
	$('#orbital').val([window.location.hash.substring(1)])
	points = renderOrbital()



	var geometry = new THREE.Geometry();

	particles = new THREE.ParticleSystem( geometry, shaderMaterial );

	particles.dynamic = true;
	//particles.sortParticles = true;


	applyVerticesToGeometry(points, particles.geometry)
	applyColorsToAttributes(points, attributes)


	scene.add( particles );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( WIDTH, HEIGHT );
	renderer.setClearColor(0x000000)

	var container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	$(window).resize(onWindowResize);

	$('#container').click(onDocumentMouseDown);
	$('#container').mousemove(onDocumentMouseMove);
	document.addEventListener('mousewheel', onDocumentMouseWheel, false );
}



function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}



function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
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
		updateCamera()
//		console.log(camera.position.y)
	}
}



function updateCamera() {
		var degRad = Math.PI / 360 
		var thetaR = theta * degRad
		var phiRad = phi   * degRad
		var cosPhi = Math.cos( phiRad )
		var sinPhi = Math.sin( phiRad )

//		console.log(sinPhi)
		// if (sinPhi<0) {
		// 	sinPhi = 0
		// 	cosPhi = 1
		// }

		camera.position.x = cameraDist * Math.sin( thetaR ) * cosPhi;
		camera.position.y = cameraDist * sinPhi; // y acts like z
		camera.position.z = cameraDist * Math.cos( thetaR ) * cosPhi;


		camera.lookAt(origin)
		camera.updateMatrix();
}



function onDocumentMouseWheel( event ) {
	if ( isMouseActive ) {
		event.preventDefault();
		cameraDist -= event.wheelDeltaY;
		updateCamera()
	}
}



function render() {
	var time = Date.now();

	for( var i = 0; i < attributes.size.value.length; i++ ) {
		attributes.size.value[ i ] = shell + 10 * Math.sin( 0.1 * i + time * 0.005 ) + 5 * Math.cos(i + time * 0.005);
	}
	attributes.size.needsUpdate = true;

	renderer.render( scene, camera );
}



$(function(){
	init();
	animate();
})
