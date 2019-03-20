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

var divideBy8
console.log("load WebAssembly");

loadWebAssembly('divideby8.wasm')
	.then(function(webAssm){
		console.log("exporting module")
		var method = getFirstKeyContaining(webAssm.exports, "mustBeFaster");
		console.log("found method " + method)
		divideBy8 = webAssm.exports[method]; //_Z12mustBeFasterj;
	})
	.then(function(){
		var msg = " 32 divided by 8 is " + divideBy8(32);
		document.getElementById("result").textContent = msg
		console.log(msg);
	});

console.log("finished");