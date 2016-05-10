Obfilter
========

A small library to compare objects using simple rules

## Installation

	npm install obfilter --save

## Usage

	var obfilter = require('obfilter');

	var structureRule = {
		structure: true
	};

	var matchSome = {
		match:{
			some:true
		}
	};

	var matchAll = {
		match:{
			all:true
		}
	};

	var test = {
		contributors:["Andrew","Batman"]
	};

	var match = {
		contributors:["Batman"]
	};


	obfilter.filterObject(test,match,matchSome); // returns true
	obfilter.filterObject(test,match,matchAll); // returns false




## Tests

	npm test

## Contributing

Whatever bro

## Release History

* 0.0.1 Initial release