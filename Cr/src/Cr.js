/**
 * Cr.js
 * Cr.js is a small JavaScript library for Chrome
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * Copyright (c) 2011 Tangoboy
 * version : $version$ $release$ released
 * author : zhulutangoboy@gmail.com
 * date : 2011.09.03
 */


/* CORE 核心{ */
/**
 * namespace : $ = Cr
 * API:
 * Cr() //[目前没有任何作用]
 * new Cr() //[目前没有任何作用]
 * 
 * Cr.mix() //对象混合
 * Cr.merge() //多对象混合
 * Cr.toArray() //类数组转数组
 * Cr.noConflict() //转让命名空间
 * Cr.namespace()  //创建命名空间
 * Cr.app() //创建应用
 * Cr.type()  //类型判断
 * Cr.inherit()  //类继承机制
 * Cr.error()  //抛出异常
 * Cr.log() //日志记录
 * Cr.noop()  //空方法
 * 
 */
;;(function(HOST, NS, UNDEFINED){
var meta = {
	/**
	 * 对象混合
	 */
	mix : function(receiver, supplier, override, whitelist) {
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
	},
	/**
	 * 多个对象合并为一个对象
	 * @return {Object}
	 */
	merge: function() {
		var o = {}, i, l = arguments.length;
		for (i = 0; i < l; i++) {
		    meta.mix(o, arguments[i]);
		}
		return o;
	},
	/**
	 * 类数组转数组
	 */
	toArray: function(arr){
		return [].slice.call(arr);
	},
	createApp: function(){
		var instant = '@new',method = '@()',ptp = 'prototype',
		APP = function(){
			var self = arguments.callee;
			//new APP() 与  APP()两种方式路由
			if(this instanceof self){
				return instant in this ? 
						this[instant].apply(this, arguments) : UNDEFINED;
			}else{
				return method in self[ptp] ? 
						self[ptp][method].apply(this, arguments) : UNDEFINED;
			}
		};
		APP[ptp][instant] = noop;
		APP[ptp][method] = noop;
		return APP;
	}
},
noop = function(){},
_Cr = HOST[NS],
_$ = HOST.$,
CORE = meta.createApp();



/**
 * 类型判断
 * @param {*} obj
 * @param {string= } type
 */
function type (obj, type) {
	var ts = {}.toString,
		_types = {
		    'undefined' : 'undefined',
		    'number' : 'number',
		    'boolean' : 'boolean',
		    'string' : 'string'
		},
		t = obj===null ? 'null' :
		(_types[typeof obj] || ts.call(obj).slice(8,-1).toLowerCase());
	return type ? t===type : t;
}

/**
 * 转让命名
 */
function noConflict(all) {
	if (HOST.$ === CORE) {
		HOST.$ = _$;
	}
	if (all && HOST[NS] === CORE) {
		HOST[NS] = _Cr;
	}
	return CORE;
}
/**
 * 命名空间
 * @param {string} spaces
 * @param {*= } root
 */
function namespace(spaces, root){
	 if(!spaces)return;
	 spaces.replace(/([\.]?)([^\.]+)/g,function(a,b,c){
		 root = b ? (root||CORE) : (root||HOST);
		 root[c] = root[c] || {};
		 root = root[c];
	 });
	 return root;
}
/**
 * 添加应用
 * @param {string} name
 * @param {*= } app
 */
function app(name, sx){
	var isstr = type(name, 'string'),
		O = isstr ? CORE[name] || {} : name;
	meta.mix(O, type(sx, 'function') ? sx() : sx);
	isstr && (CORE[name] = O);
	return O;
}

/**
 * 类继承机制
 */
function inherit(child, supertype, extend){
	child.prototype.__proto__ = supertype.prototype || {};
	meta.mix(child.prototype, extend);
	return child;
}
/**
 * 对象克隆 
 */
function clone(obj) {
    function newObj(){}
    newObj.prototype = obj;
    return new newObj();
}
/**
 * 抛出异常
 */
function error(obj, type) {
	type = type || Error;
	throw new type(obj);
}


/**
 * 日志
 */
function log() {
	var a = arguments,
		m,
		l = a.length,
		c = a[0],
		t = /^(assert|count|debug|dir|dirxml|error|info|log|warn)\:?(.*)/;

	if(type(c,'string') && (m = c.match(t))){
		a[0] = m[2];
		console[m[1]].apply(console,a);
	}else{
		console.log.apply(console,a);
	}
}

meta.mix(CORE, {
	toString: {}.toString,
	version: '@VERSION@',
	buildTime: '@TIMESTAMP@',
	config: {},
	path: '',
	noConflict: noConflict,
	mix: meta.mix,
	merge: meta.merge,
	toArray:meta.toArray,
	type: type,
	inherit: inherit,
	namespace: namespace,
	app: app,
	error: error,
	log: log,
	noop: noop
});

meta.mix(CORE.prototype, {
	'@new':function(n){
		return 'new todo';
	},
	'@()':function(){
		return '() todo';
	}
});



HOST.$ = HOST[NS] = CORE;
})(this,'Cr');
/* }CORE 核心 */





/* DOM 模块 */
/**
 * namespace : Cr.dom
 * API:
 * Cr.dom(selector, context) //选择器
 * Cr.dom().setArray(arr)
 * Cr.dom().makeArray(elems)
 * 
 * Cr.dom().length
 * Cr.dom().concat()
 * Cr.dom().indexOf()
 * Cr.dom().lastIndexOf()
 * Cr.dom().join()
 * Cr.dom().pop()
 * Cr.dom().push()
 * Cr.dom().reverse()
 * Cr.dom().shift()
 * Cr.dom().slice()
 * Cr.dom().sort()
 * Cr.dom().splice()
 * Cr.dom().toString()
 * Cr.dom().unshift()
 * Cr.dom().valueOf()
 * Cr.dom().every()
 * Cr.dom().some()
 * Cr.dom().forEach()
 * Cr.dom().map()
 * Cr.dom().filter()
 * 
 * Cr.dom().get()
 * Cr.dom().eq()
 * Cr.dom().props(name, value)
 * Cr.dom().attr()
 * Cr.dom().text()
 * Cr.dom().html()
 * Cr.dom().val()
 * Cr.dom().data()
 * Cr.dom().getStyle()
 * Cr.dom().setStyle()
 * Cr.dom().hasClass()
 * Cr.dom().addClass()
 * Cr.dom().removeClass()
 * Cr.dom().replaceClass()
 * 
 * Cr.dom.ready(fn)
 * Cr.dom.parseXML(strxml)
 * 
 * Cr.path //Cr.js库url
 * Cr.url
 */
;;(function(HOST, $, UNDEFINED){
	var dom = $.dom = function(selector, context){
		return new dom.fn.init(selector, context);
	},
	readyfns = [];

	function regexpClass(s){
		return new RegExp('(?:^|[ \\t\\r\\n\\f])' + s + '(?:$|[ \\t\\r\\n\\f])');
	}
	
	
	/* 对dom对象拓展  */
	$.mix(dom,{
		toString:{}.toString,
		doc: HOST.document,
		isReady: !1,
		ready: function(fn){
			if(dom.isReady){
				fn.call(dom,$);
			}else{
				readyfns.push(fn);
			}
		},
		parseXML: function(data) {
            var xml;
            try {
                xml = new DOMParser().parseFromString(data, "text/xml");
            } catch(e) {
                $.log("error:parseXML error!",e);
                xml = UNDEFINED;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                $.error("Invalid XML: " + data);
            }
            return xml;
        }
	});


	/* dom实例原型 继承于Array */
	dom.fn  = dom.prototype = {
		__proto__: Array.prototype,
		constructor: dom,
		init: function(selector, context){
			if (!selector ) {
				return this;
			}
			if( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}
			if ($.type(selector,"string")) {
				context = context || dom.doc;
				this.length = 0;//设置length以及重排索引
				var elems = context.querySelectorAll(selector);
				return this.setArray(this.makeArray(elems));
			}
		},
		setArray : function(arr) {
			  this.length = 0;//设置length以及重排索引
			  [].push.apply(this, arr);
			  return this;
		},
		makeArray:function(elems) {//把传入参数变成数组
		  var ret = [];
		  if( elems != null ){
			  var i = elems.length;
			//单个元素，但window, string、 function有 'length'的属性，加其它的判断
			if( i == null || elems.split || elems.setInterval || elems.call ){
			  ret[0] = elems;
			}else{
			  try{
				ret = $.toArray(elems);
			  }catch(e){
				while( i ) ret[--i] = elems[i];//Clone数组
			  }
			}
		  }
		  return ret;
		},
		props: function(name, value) {
			if (value === UNDEFINED) {
				var v = [];
				this.forEach(function(el){
					v.push(el[name]);
				});
				return v;
			} else {
				this.forEach(function(el){
					el[name] = value;
				});
				return this;
			}
		},
		get: function( num ) {
			return num === UNDEFINED ? this : this[ num ];
		},
		eq: function( i ) {
			return i === -1 ?
				this.slice( i ) :
				this.slice( i, +i + 1 );
		},
		text: function(value){
			return this.props('textContent',value);
		},
		html: function(value){
			return this.props('innerHTML',value);
		},
		val: function(value){
			if(value === UNDEFINED){
				var v = [];
				this.forEach(function(el){
					if(el.tagName.toLowerCase() === 'input'){
						switch(el.type){
							case 'checkbox':
							case 'radio':
								v.push(el.checked);
								break;
						}
					}else{
						v.push(el.value);
					}
				});
				return v;
			} else {
				return this.props('value', value);
			}
		},
		attr: function(name,value){
			if(value === UNDEFINED){
				var v = [];
				this.forEach(function(el){
					v.push(el.getAttribute(name));
				});
				return v;
			}else if($.type(value) === 'null'){
				this.forEach(function(el){
					el.removeAttribute(name);
				});
			}else{
				this.forEach(function(el){
					el.setAttribute(name, value);
				});
			}
			return this;
			
		},
		data: function(name,value){
			if(value === UNDEFINED){
				var v = [];
				this.forEach(function(el){
					v.push(el.dataset[name]);
				});
				return v;
			}else if($.type(value) === 'null'){
				this.forEach(function(el){
					delete el.dataset[name];
				});
			}else{
				this.forEach(function(el){
					el.dataset[name] = value;
				});
			}
			return this;
		},
		getStyle: function(name,computedStyle){
			var v = [];
			if(computedStyle){
				var getstyle = $.dom.doc.defaultView.getComputedStyle;
				this.forEach(function(el){
					v.push(getstyle(el)[name]);
				});
			}else{
				this.forEach(function(el){
					v.push(el.style[name]);
				});
			}
			return v;
		},
		setStyle: function(name,value){
			if(value === UNDEFINED){
				if($.type(name)==='object'){
					this.forEach(function(el){
						$.mix(el.style,name);
					});
				}else{
					this.forEach(function(el){
						el.style.cssText+=name;
					});
				}
			}else{
				this.forEach(function(el){
					el.style[name] = value;
				});
			}
		},
		hasClass: function(name){
			var v = [];
			this.forEach(function(el){
				if(name && el.className){
					v.push(regexpClass(name).test(el.className));
				}else{
					v.push(!1);
				}
			});
			return v;
		},
		addClass: function(name){
			this.forEach(function(el){
				var arr = [];
				if(el.className){
					arr = el.className.split(' ');
					if(arr.indexOf(name)==-1) arr.push(name);
				} else {
					arr.push(name);
				}
				el.className = arr.join(' ');
			});
			return this;
		},
		removeClass: function(name){
			var regexp = regexpClass(name);
			this.replaceClass(regexp,'');
			return this;
		},
		replaceClass: function(name,rename){
			this.forEach(function(el){
				if(el.className){
					el.className = el.className.replace(name, rename).trim();
				}
			});
			return this;
		}
	};
	dom.fn.init.prototype = dom.fn;



	HOST.addEventListener( "DOMContentLoaded",function(){
		dom.isReady = !0;
		readyfns.forEach(function(fn){
			fn.call(dom,$);
		});
		HOST.removeEventListener("DOMContentLoaded",arguments.callee, !1);//清除加载函数
	}, false);
	HOST.addEventListener( "load", function(){
		readyfns = [];
	}, false);




	/* 对内核拓展  */
	$.mix($,{
		path:(function() {
            var sTags = dom.doc.getElementsByTagName("script");
            return sTags[sTags.length - 1].src.replace(/\/[^\/]+\/[^\/]+$/, "/");
        }()),
        url:function(url){ 
    	    var a =  document.createElement('a');  
    	    a.href = url;
        	return {
        		href :a.href,
        		origin :a.origin,
        		protocol :a.protocol,
        		host :a.host,
        		hostname :a.hostname,
        		port: a.port,
                hash: a.hash,
                pathname :a.pathname,
                search :a.search,
                params :(function(){
                    var ret = {},
                        seg = a.search.replace(/^\?/,'').split('&'),
                        len = seg.length, i = 0, s;
                    for (;i<len;i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),  
                file :(a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
                relative :(a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  
                segments :a.pathname.replace(/^\//,'').split('/')
        	};
        }
	});

})(this, Cr);

/* }DOM模块 */


/* Event模块 { */
/* 

 
*/
;;(function(HOST, $, UNDEFINED){
	//http://www.w3.org/TR/DOM-Level-3-Events/
var eventType = [
                 /* User Interface event types: */
                 'DOMFocusIn','DOMFocusOut','DOMActivate',
                 
                 /* Text event types: */
                 'textInput',
                 
                 /* Mouse event types: */
                 'click','dblclick','mousedown','mouseup',
                 'mouseover','mousemove','mouseout','mouseenter',
                 'mouseleave','wheel',
                 
                 /* Keyboard event types: */
                 'keydown','keyup','keypress',
                 
                 /* Composition event types: */
                 'compositionstart','compositionupdate',
                 'compositionend',
                 
                 /* Mutation and mutation name event types: */
                 'DOMSubtreeModified','DOMNodeInserted','DOMNodeRemoved',
                 'DOMNodeRemovedFromDocument','DOMNodeInsertedIntoDocument',
                 'DOMAttrModified','DOMCharacterDataModified',
                 'DOMElementNameChanged','DOMAttributeNameChanged',
                 
                 /* Basic event types: */
                 'load','unload','abort','error','select','change','submit',
                 'reset','focus','blur','resize','scroll','beforeunload',
                 
                 
                 /*  */
                 'DOMContentLoaded',
                 /* hash */
                 'hashchange',];

/*
$.mix($,{
	addEvent:function(element, event, handle){
		element.addEventListener(event, handle, !1);
	},
	removeEvent:function(element, event, handle){
		element.removeEventListener(event, handle, !1);
	}
});
*/

})(this, Cr);
/* }Event模块 */




/* 传输 模块 { */
/**
 * namespace : Cr.hr
 * API:
 * Cr.hr.jsonp(url,data,callback) //jsonp 跨域
 * Cr.hr.ajax(url,options)
 * Cr.hr.get(url,data,callback,format)
 * Cr.hr.post(url,data,callback,format)
 * 
 */
;;(function(HOST, $, UNDEFINED){
	var hr = $.namespace('.hr'),
		doc = HOST.document;
	function param(obj){
		var tarr = [];
		for(k in obj){
			tarr.push(k+"="+obj[k]);
		}
		return tarr.join('&');
	}
	$.mix(hr, {
		jsonp:function(url,data,callback){
			HOST.jsonp_callback = HOST.jsonp_callback || {};
			var head = doc.getElementsByTagName('head')[0],
				script = doc.createElement('script'),
				p = $.type(data,'object') ? param(data) : data,
				_this = this,
				fun = (function(){
					var id = '';
					do{
						id = Math.floor(Math.random()*10000);
					}while(HOST.jsonp_callback[id]);
					return {id : id, name : 'window.jsonp_callback['+id+']'};
				})();
				
			script.type = 'text/javascript';
			script.charset = 'utf-8';
			
			if(head){
				head.appendChild(script);
			}else{
				doc.body.appendChild(script);
			}
			HOST.jsonp_callback[fun.id] = function(data){
				callback(data);
				HOST.setTimeout(function(){
					delete HOST.jsonp_callback[fun.id];
					script.parentNode.removeChild(script);
				}, 100);
			};
			script.src = url+'?callback='+fun.name+'&'+p;
		},
		get:function(url,data,callback,format){
			format = format || "text";
			if(!$.type(data, 'function')){
				return this.ajax(url,{"data":data,success:callback,"format":format});
			}else{
				return this.ajax(url,{"data":null,success:data,"format":callback});
			}
		},
		post:function(url,data,callback,format){
			format = format || "text";
			if(!$.type(data, 'function')){
				return this.ajax(url,{method:"post","data":data,success:callback,"format":format});
			}else{
				return this.ajax(url,{method:"post","data":null,success:data,"format":callback});
			}
		},
		ajax:function(url,options){
			xhr = this._createXhr();
			var op = $.mix({
	            method:  'get',
	            async:   true,
	            data:    null,
	            format:  'text',
	            encode:  'UTF-8',
	            success: function(){},
	            failure: function(){},
				whatever:function(){}
	        }, options || {});
			if($.type(op.data, 'object')){
				op.data = param(op.data);
			}
			if (op.method == 'get'){
	            url += (url.indexOf('?') == -1 ? '?' : '&') + op.data;
	            op.data = null;
	        }
			xhr.open(op.method, url, op.async);
			if(op.method == 'post'){
	            xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=' + op.encode);
	        }
	        xhr.onreadystatechange = this._onStateChange.call(this, xhr, op);
	        xhr.send(op.data || null);
		},
		_createXhr:function(){ 
			return new HOST.XMLHttpRequest();
		},
		_onStateChange:function(xhr,op){
			if(xhr.readyState == 4){
				xhr.onreadystatechange = function(){};
				var s = xhr.status, tmp = xhr;
				if(!op.success) return;
				if(op.whatever) op.whatever(xhr);
				if(!!s && s>= 200 && s < 300){
					if($.type(op.format, 'string')){
						switch (op.format){
							case 'text':
								tmp = xhr.responseText;
								break;
							case 'json':
								tmp = parseJSON(xhr.responseText);
								break;
							case 'xml':
								tmp = xhr.responseXML;
								break;
						}
					}
					op.success(tmp,xhr);
				} else {
					if(op.failure) op.failure(xhr);
				}
			}
		}
	});

})(this, Cr);

/* }传输 模块  */









/* 动画 模块 { */
(function(HOST, $, UNDEFINED){
	var prefix = '-webkit-';

	function Anim(elem,config,callback){
	  this.elem = elem;
	  this.config = config;///
	  this.callback = callback || function(){};
	  this.timer = null;
	  this.isAnim = !1;
	}
	Anim.prototype = {
	  run:function(){
		//如果正在动画就不必再次动画
		if(this.isAnim)return this;

	    var s = this.elem.style,
	    self = this,
	    tconfig = this._transitionConfig(this.config);
	    //console.log(tconfig);

	    if(tconfig){
		    s[prefix+'transition-property'] = tconfig.p;
		    s[prefix+'transition-duration'] = tconfig.d;
		    s[prefix+'transition-timing-function'] = tconfig.e;
		    s[prefix+'transition-delay'] = tconfig.l;

		    s.cssText += ';' + tconfig.s;

		    //this._cleartimer();
		    this.isAnim = !0;
		    
		    this.elem.addEventListener('webkitTransitionEnd',function(){
		    	s[prefix+'transition'] = '';
			    self.isAnim = !1;
			    self.callback.call(this);
		    }, true);
	    }
	    return this;
	  },
	  _transitionConfig:function(tran){
		  var time=0,self = this;
		  if($.type(tran, "object")){
			  return {
				s:tran.style,
				p:self._animprops(tran.style).join(','),
				d:tran.duration,
				e:tran.easing,
				l:tran.delay,
				time:time
			  };
		  }else if($.type(tran, "array")){
			  var s = [],p = [],d = [],e = [],l = [],t;
			  tran.forEach(function(c){
				  s.push(c.style);
				  p.push(self._animprops(c.style));
				  d.push(c.duration);
				  e.push(c.easing);
				  l.push(c.delay);
			  });
			  return {
				  	s:s.join(''),
					p:p.join(','),
					d:d.join(','),
					e:e.join(','),
					l:l.join(','),
					time:time
			};
		  }
		  return;
	  },
	  _animprops:function(style){
		  var props = [],m;
		  style.split(";").forEach(function(s){
			  if(m = s.match(/([A-Za-z\-^:]*)\s*:([^;]+)(;|$)/)){
				  props.push(m[1]);
			  }
		  });
		  return props;
	  },
	  _cleartimer:function(){
	    this.elem.removeEventListener('webkitTransitionEnd');
	  },
	  stop:function(c){
	    this._cleartimer();
	    this.isAnim = !1;
	    this.elem.style[transition] = '';
	    
	    if(1){
	    	var getStyle = $.dom.doc.defaultView.getComputedStyle;
	    	getStyle(this.elem);
	    }
	    	
	    return this;
	  }
	};

	$.Anim = Anim;
	
	
	
})(this, Cr);
/* }动画 模块 */


