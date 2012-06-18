(function(HOST,NS,UNDEFINED){
var Z;
//实现方法链
function Spore(selector, context){
	this.init(selector, context);
	return this;
}
Spore.prototype = {
	constructor:Spore,
	init : function( selector, context ){
		context = context || HOST.document;
		
		if ( !selector ) {
			return this;
		}
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		if ( typeof selector === "string" ) {
			var elems = context.querySelectorAll(selector);
			return this.setArray(this.makeArray(elems));
			
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}
		
		if (selector.selector !== UNDEFINED) {
			this.selector = selector.selector;
			this.context = selector.context;
		}
		
		//this.setArray(this.makeArray(selector));
		return this;
	},
	setArray : function(elems) {
	  this.length = 0;//设置length以及重排索引
	  Array.prototype.push.apply(this, elems);
	  return this;
	},
	makeArray : function(arr) {//把传入参数变成数组
	  var ret = [];
	  if( arr != null ){    var i = arr.length;
		//单个元素，但window, string、 function有 'length'的属性，加其它的判断
		if( i == null || arr.split || arr.setInterval || arr.call ){
		  ret[0] = arr;
		}else{
		  try{
			ret = Array.prototype.slice.call(arr)
		  }catch(e){
			while( i ) ret[--i] = arr[i];//Clone数组
		  }
		}
	  }
	  return ret;
	},
	length: 0,
	toString : function(){//返回一个字符串
	  var array = Array.prototype.slice.call( this );
	  return array.toString();
	},
	valueOf:function(){return Array.prototype.slice.call( this );},
	shift :[].shift,
	push: [].push,
	sort: [].sort,
	pop:  [].pop,
	splice: [].splice,
	concat: [].concat,
	slice: [].slice,
	forEach: [].forEach,
	every: [].every,
	filter: [].filter,
	map: [].map,
	some: [].some,
	get: function( num ) {
	  return num === UNDEFINED ? Array.prototype.slice.call( this ) : this[ num ];
	},
	each: function( callback, args ) {
		return Z.each( this, callback, args );
	}
}
Spore.prototype[NS] = function(m){
	this.push(m);
	return this;
};



Z = function(t){
	//把外部扩展的方法加入到孢子原型对象中
	Z.mix(Spore.prototype,Z.fn);
	return new Spore(t);
};

Z.mix = function(receiver, supplier, override, whitelist) {
	if (!supplier || !receiver) return receiver;
	if (override === UNDEFINED) override = true;
	var i, p, len;

	if (whitelist && (len = whitelist.length)) {
		for (i = 0; i < len; i++) {
			p = whitelist[i];
			if (p in supplier) {
				_mix(p, receiver, supplier, override);
			}
		}
	} else {
		for (p in supplier) {
			_mix(p, receiver, supplier, override);
		}
	}
	return receiver;
	
	function _mix(property, receiver, supplier, override) {
		if (override || !(property in receiver)) {
			receiver[property] = supplier[property];
		}
	} 
};



Z = Z.mix(Z,{
	/*类型检测*/
	isString:function(s){
		return Object.prototype.toString.call(s)==="[object String]";
	}
	,isNumber:function(n){
		return Object.prototype.toString.call(n)==="[object Number]";
	}
	,isBoolean:function(b){
		return Object.prototype.toString.call(b)==="[object Boolean]";
	}
	,isObject:function(o){
		return Object.prototype.toString.call(o)==="[object Object]";
	}
	,isArray:function(a){
		return Object.prototype.toString.call(a)==="[object Array]";
	}
	,isFunction:function(f){
		return Object.prototype.toString.call(f)==="[object Function]";
	}
	,isRegExp:function(r){
		return Object.prototype.toString.call(r)==="[object RegExp]";
	}
	,isDate:function(d){
		return Object.prototype.toString.call(d)==="[object Date]";
	}
	,each:function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || Z.isFunction(object);
		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}
		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	}
})
/*拓展*/
Z.fn = Z.mix(Z.fn||{},{
	hello:function(){
		alert("hello");
	}
});





//
HOST[NS] = Z;
})(this,"$");
