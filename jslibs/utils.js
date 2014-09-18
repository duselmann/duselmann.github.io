// Copyright David Uselmann 2013
// feel free to use this for education purposes
// this document is under the MIT Compyright by extension of the Class.js

var debug = true
// math aliases
var abs=Math.abs, sqrt=Math.sqrt, sqrt2=Math.sqrt2, exp=Math.exp, pow=Math.pow, min=Math.min, max=Math.max, rand=Math.random
// trig aliases
var cos=Math.cos, sin=Math.sin, tan=Math.tan, acos=Math.acos, asin=Math.asin, atan=Math.atan2, pi=Math.PI, pi2=2*pi


String.prototype.replaceAt=function(index, rep) {
	return this.substr(0, index) + rep + this.substr(index+rep.length);
}
/**
 * ReplaceAll by Fagner Brack (MIT Licensed)
 * Replaces all occurrences of a substring in a string
 */
String.prototype.replaceAll = function(token, newToken, ignoreCase) {
    var str, i = -1, _token;
    if((str = this.toString()) && typeof token === "string") {
        _token = ignoreCase === true? token.toLowerCase() : undefined;
        while((i = (
            _token !== undefined? 
                str.toLowerCase().indexOf(
                            _token, 
                            i >= 0? i + newToken.length : 0
                ) : str.indexOf(
                            token,
                            i >= 0? i + newToken.length : 0
                )
        )) !== -1 ) {
            str = str.substring(0, i)
                    .concat(newToken)
                    .concat(str.substring(i + token.length));
        }
    }
return str;
};

function isDefined(value) {
	return typeof value !== 'undefined';
}
function isArray(value) {
	return Array.isArray(value);
}
function isObject(value) {
	return typeof value === 'object';
}
function isFunction(value) {
	return typeof value === 'function';
}
function deepClone(obj) {
	// do not clone function or raw types
	if ( ! isObject(obj) || isFunction(obj) ) {
		return obj;
	}
	var clone = {};
	var keys  = Object.keys(obj);
	for (k in keys) {
		var key = keys[k];
		clone[key] = deepClone(obj[key]);
	}
	return clone;
}
function defaultValue(value,defaultValue) {
	return isDefined(value) ? value : defaultValue;
}
function log(message, values) {
	if ( ! debug || ! console ) return;
	for (v in values) {
		message   = message.replace('{}',values[v]);
	}
	console.log(message);
}
function fillStr(str,count) {
	var fill ='';
	for (var c=0; c<count; c++) {
		fill += str;
	}
	return fill;
}


var swap = function(array, a, b) {
//	var array = this
	var tmp=array[a]
	array[a]=array[b]
	array[b]=tmp
}
// TODO Array.prototype
var addAllArray=function(target, source) {
	for (var s=0; s<source.length; s++) { // cannot use 'in' because it includes prototype methods
		var entry = source[s]
		target.push(entry)
	}
}
// TODO Array.prototype
var removeValueFromArray = function(array, value) {
		var index  = array.indexOf(value)
		array.splice(index, 1)
}
// TODO Array.prototype
var findByAttribute = function(array, attrib, value) {
	for (var a in array) {
		var entry = array[a]
		if ( entry[attrib] === value ) {
			return entry
		}
	}
	return undefined
}



function partition(array, begin, end, pivot, by) {
	var piv=array[pivot];
	if (by) {
		piv = piv[by]
	}
	swap(array, pivot, end-1);
	var store=begin;
	var ix;
	for (ix=begin; ix<end-1; ++ix) {
		var value = array[ix]
		if (by) {
			value = value[by]
		}
		if (value<=piv) {
			swap(array, store, ix);
			++store;
		}
	}
	swap(array, end-1, store);

	return store;
}
function qsort(array, begin, end, by) {
	if (end-1>begin) {
		var pivot=begin+Math.floor(Math.random()*(end-begin));

		pivot=partition(array, begin, end, pivot, by);

		qsort(array, begin, pivot, by);
		qsort(array, pivot+1, end, by);
	}
}
function quickSort(array, by) {
	qsort(array, 0, array.length, by);
}

