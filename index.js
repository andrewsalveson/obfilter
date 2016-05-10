/**
 *
 * Determine whether an object matches a given object pattern
 *
 *
 */
module.exports = {
  /*
   * Identify object for simple equality comparison
   *
   * @param	{Object}
   * @return {Boolean}
   */
  isSimple: function(obj){
    return(typeof obj=='string'||typeof obj=='number'||typeof obj=='boolean');
  },
  /*
   * Match arrays
   *
   * @param {Array} arr,{Object} filter,{Object} rules
   * @return {Boolean}
   */
  filterArray: function(arr,filter,rules){
    // no match, structure ok
    var structure = true;
    var anyMatch = false;
    for(var i in filter){
      var hasMatch = false;
      var f = filter[i];
      for(var ai in arr){
        if(!rules.match&&this.isSimple(f)){
          anyMatch = true;
          hasMatch = true;
        }else{
          var match = this.filterObject(arr[ai],f,rules);
          if(rules.match&&rules.match.some&&match){
            return true;
          }
          if(match){
            anyMatch = true;
            hasMatch = true;
          }
        }
      }
      if(rules.match&&rules.match.all&&!hasMatch){
        return false;
      }
    }
    return anyMatch;
  },
  /*
   * Match objects
   *
   * @param {Object} obj, {Object} filter, {Object} rules
   * @return {Boolean}
   */
  filterObject: function(obj,filter,rules){
    if(obj===null||typeof obj=='undefined'){
      // disallow filtering on null or undefined
      return false;
    }else if(this.isSimple(filter)){
      // simple comparison for strings and numbers
      return filter===obj;
    }else if(Array.isArray(filter)){
      if(!Array.isArray(obj)){
        return false;
      }
      // array comparison
      return this.filterArray(obj,filter,rules);
    }else{
      // no match yet, structure fine
      var anyMatch = false;
      var structure = true;
      
      for(var v in filter){
        // check each key
        if(rules&&rules.structure&&!obj[v]){         
          // immediate failure if structure required and no value
          return false;
        }
        if(rules&&rules.match){
          // there are matching rules
          var match = this.filterObject(obj[v],filter[v],rules);
          if(rules.match.all&&!match){
            // we need all and at least one is missing
            return false;
          }else if(rules.match&&rules.match.some&&match){
            // we only need one and there is at least one
            return true;
          }
          // any other match rule (empty match object)
          if(match){
            anyMatch = true;
          }
        }else{
          // if we're here, we only care about structure
          anyMatch = true; // we don't care about matches
          var f = filter[v];
          var match;
          if(this.isSimple(f)){
            // any value is okay as long as it's a string or number
            match=true;
          }else{
            // otherwise recurse
            match = this.filterObject(obj[v],filter[v],rules);
          }
          if(!match){
            // no match, so the structure must be bad
            structure = false;
          }
        }
      }
      return anyMatch&&structure;
    }
    return false;
  }
 }