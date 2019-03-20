console.log("start");

function getFirstKeyContaining(obj, keyContains) {
	var members = Object.keys(obj);
	for (var k in members) {
		var key = members[k];
		if (key.indexOf(keyContains) >= 0) {
			return key;
		}
	}
}

function loadWebAssembly(filename) {
	console.log("fetching " + filename);
	return fetch(filename)
		.then (function(resp){
			console.log("getting arrayBuffer from " + filename)
			return resp.arrayBuffer();
		})
		.then(function(arrayBuffer){
			console.log("compiled module from " + filename)
			return WebAssembly.compile(arrayBuffer);
		})
		.then(function(compiledModule){
			console.log("Instance of module from " + filename)
			return new WebAssembly.Instance(compiledModule);
		});
}

var mandelbrot
console.log("load WebAssembly");

loadWebAssembly('mandelbrot.wasm')
	.then(function(webAssm){
		console.log("exporting module")
		var method = getFirstKeyContaining(webAssm.exports, "mandelbrot");
		console.log("found method " + method)
		mandelbrot = webAssm.exports[method];
	});

console.log("finished");