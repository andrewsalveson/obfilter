var assert = require('chai').assert,
	obfilter = require('../index');

// must match all (bad structure ignored)
var all = {
	match:{
		all:true
	}
};

// must match some (bad structure ignored)
var some = {
	match:{
		some:true
	}
};

// must match structure (bad matches ignored)
var structure = {
	structure:true
};

// must match on all branches and structure
var all_structure = {
	structure:true,
	match:{
		all:true
	}
};

// must match structure and at least some of values (bad branches ignored)
var some_structure = {
structure:true,
	match:{
		some:true
	}
};

var rulesets = [null,all,some,structure,all_structure,some_structure];
var trueTypes = [true,false,'a',5,5.5];
var falseTypes = [{},[],NaN,null,undefined];

describe('Obfilter',function(){
	describe('simple match identifier',function(){
		it('should identify all simple types by returning True',function(){
			for(var i in trueTypes){
				var type = trueTypes[i];
				assert.isTrue(obfilter.isSimple(type));
			}
		});
	});
	describe('equality matches: true types',function(){
		it('should match all simple types as equal to themselves for each ruleset',function(){
			for(var i in trueTypes){
	    		var type = trueTypes[i];
	    		for(var r in rulesets){
	      			var rule = rulesets[r];
	      			assert.isTrue(obfilter.filterObject(type,type,rule));
				}
	  		}
	  	});
	});
	describe('equality matches: false types',function(){
		it('should match all weird types as not equal to themselves for each ruleset',function(){
			for(var i in falseTypes){
	    		var type = falseTypes[i];
	    		for(var r in rulesets){
	      			var rule = rulesets[r];
	      			assert.isFalse(obfilter.filterObject(type,type,rule));
				}
	  		}
	  	});
	});
	describe('complex matches',function(){
		it('should match for inclusion in arrays with "some" flag',function(){
		    assert.isTrue(obfilter.filterObject(['a',null,'c',5,true],['c'],some));
		    assert.isTrue(obfilter.filterObject(['a',null,'c',5,true],[5],some));
		    assert.isTrue(obfilter.filterObject(['a',null,'c',5,true],['c','e'],some));
    		assert.isFalse(obfilter.filterObject(['a',null,'c',5,true],['e'],some));
		});
		it('should match all for inclusion in arrays with "all" flag',function(){
		    assert.isTrue(obfilter.filterObject(['a',null,'c',5,true],['c'],all));
    		assert.isFalse(obfilter.filterObject(['a',null,'c',5,true],['e'],all));
    		assert.isFalse(obfilter.filterObject(['a',null,'c',5,true],['c','e'],all));
    		assert.isTrue(obfilter.filterObject(['a',null,'c',5,true],['c',5],all));
		});
		it('should match misc',function(){
		    assert.isTrue(obfilter.filterObject(['a',null,'c',5,true],['e'],{}));
    		assert.isFalse(obfilter.filterObject(['a',null,'c',5,true],[null],{}));
		});
		it('should ignore everything but structure when only the structure flag is set',function(){
		    assert.isTrue(obfilter.filterObject({f:{ba:'boo'}},{f:{ba:'baa'}},structure));
		    assert.isTrue(obfilter.filterObject({a:{b:['a','b']}},{a:{b:['a','c']}},structure));
		    assert.isTrue(obfilter.filterObject({a:{b:['a','b']}},{a:{b:['a']}},structure));
		    assert.isTrue(obfilter.filterObject({a:{b:{c:true}}},{a:{b:{c:true}}},structure));
		    assert.isTrue(obfilter.filterObject({a:{b:{c:true}}},{a:{b:{c:false}}},structure));
		});
		it('should match complex requirements',function(){
		    assert.isTrue(obfilter.filterObject({a:['b','c']},{a:['b']},some_structure));
		    assert.isTrue(obfilter.filterObject({a:{b:{c:[1,2,3]}}},{a:{b:{c:[1,2,3]}}},all));
		    assert.isTrue(obfilter.filterObject({a:{b:{c:[1,2,3]}}},{a:{b:{c:[1,2,4]}}},some));
		    assert.isTrue(obfilter.filterObject({a:[1,2],b:[1,2]},{a:[1,4],b:[1,2,4]},some));
		    assert.isTrue(obfilter.filterObject({a:[1,2],b:[1,2]},{a:[5,4],b:[1,2,4]},some));
    		assert.isFalse(obfilter.filterObject({f:{ba:'boo'}},{f:{ba:'baa'}},some_structure));
    		assert.isFalse(obfilter.filterObject({f:{ba:'boo'}},{f:{bo:'baa'}},structure));
    		assert.isFalse(obfilter.filterObject({a:{b:['a','b']}},{a:{c:['a','c']}},structure));
    		assert.isFalse(obfilter.filterObject({a:{b:['a','b']}},{a:{c:['a']}},structure));
    		assert.isFalse(obfilter.filterObject({},{a:'b'},some_structure));
    		assert.isFalse(obfilter.filterObject({a:{b:'a',c:'b'}},{a:{c:'a'}},some_structure));
    		assert.isFalse(obfilter.filterObject({a:{b:{c:true}}},{a:{b:{c:false}}},all));
    		assert.isFalse(obfilter.filterObject({a:{b:{c:[1,2,3]}}},{a:{b:{c:[1,2,4]}}},all));
    		assert.isFalse(obfilter.filterObject({a:[1,2],b:[1,2]},{a:[5,4],b:[1,2,4]},all));
    		assert.isFalse(obfilter.filterObject({a:{b:{c:true}}},{a:{b:{c:null}}},all));
		});
	});
});