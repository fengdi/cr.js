/*
**************************************************************
	$DOM Namespace
	author Tangoboy
	2010-07-08
*/

(function(){
var opt = Object.prototype.toString,
isFun = function(f){return opt.call(f)==="[object Function]"},
isStr = function(f){return opt.call(f)==="[object String]"},
isObj = function(o){return opt.call(o)==="[object Object]"},
trim = function( text ) {
	return (text || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "" );
};
function Cookie(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
// written by Dean Edwards, 2005
function addEvent(element, type, handler) {
  // 为每个事件处理程序分配一个唯一的id
  if (!handler.$$guid) handler.$$guid = addEvent.guid++;
  // 为该元素的各种事件类型创建一个hash表
  if (!element.events) element.events = {};
  // 为每一个元素/事件对的所有事件处理程序创建一个hash表
  var handlers = element.events[type];
  if (!handlers) {
    handlers = element.events[type] = {};
    // 存储已经存在的事件处理程序(如果有的话)
    if (element["on" + type]) {
      handlers[0] = element["on" + type];
    }
  }
  // 将事件处理程序存储到hash表内
  handlers[handler.$$guid] = handler;
  // 剩下的任务交给一个全局的事件处理程序来搞定
  element["on" + type] = handleEvent;
};
// 一个用来分配唯一ID的计数器
addEvent.guid = 1;
function removeEvent(element, type, handler) {
  // 从hash表里面删除该事件处理程序
  if (element.events && element.events[type]) {
    delete element.events[type][handler.$$guid];
  }
};
function handleEvent(event) {
  var returnValue = true;
  // 取得event对象(IE使用了一个全局的事件对象)
  event = event || fixEvent(window.event);
  // 找到事件处理程序的hash表
  var handlers = this.events[event.type];
  // 执行各个事件处理程序
  for (var i in handlers) {
    this.$$handleEvent = handlers[i];
    if (this.$$handleEvent(event) === false) {
      returnValue = false;
    }
  }
  return returnValue;
};

function fixEvent(event) {
  // 增加符合W3C标准的事件模型
  event.preventDefault = fixEvent.preventDefault;
  event.stopPropagation = fixEvent.stopPropagation;
  return event;
};
fixEvent.preventDefault = function() {
  this.returnValue = false;
};
fixEvent.stopPropagation = function() {
  this.cancelBubble = true;
};
	window["$DOM"] = {
		readyfn:[],
		isReady : false,
		doc:window.document,
		//选择ID
		$id:function (id) {
			var el = document.getElementById(id);
			if(!+"\v1"){
				if(el && el.attributes['id'].value === id){
					return el;
				}else{
					var els = document.all[id],n = els.length;
					for(var i=0;i<n;i++){
						if(els[i].attributes['id'].value === id){
						return els[i];
						}
					}
				}
			}
			return el;
		},
		//选择name
		$name:function(name,parent){
			parent = parent||this.doc;
			return parent.getElementsByName(name);
		},
		//选择标记
		$tag:function(tagName,parent){
			var result = [],i = 0;
			parent = parent||document;
			if(tagName === "BODY")
                return [parent.body];
            if (!+"\v1") {
                var els = parent.getElementsByTagName(tagName),
                i = els.length;
                while(i)
                    result[--i] = els[i];
                return result;
            }
            return Array["prototype"].slice.call(parent.getElementsByTagName(tagName));
		},
		//选择class
		$class:function(className, tag, parent){
			parent = parent || ((typeof(tag)!=="undefined"&&!isStr(tag))?tag:document);
			tag = isStr(tag)?tag:"*";
			var allTags = (tag === '*' && parent.all) ? parent.all : parent.getElementsByTagName(tag);
			if(allTags.getElementsByClassName){
				return allTags.getElementsByClassName(className);
			}else{
				var matchingElements = [],classn = [];
				className = trim(className);
				var regex = this._regexpClass(className);
				var element;
				for (var i = 0; i < allTags.length; i++) {
					element = allTags[i];
					if (regex.test(element.className|| element.getAttribute("class"))) {
						matchingElements.push(element);
					}
				}
				return matchingElements;
			}
		},
		//选择属性
		$attr:function(search,parent){
		    var tag = /([\*a-zA-Z1-6]*)?(\[(\w+)\s*(\^|\$|\*|\||~|!)?=?\s*([\w\u00C0-\uFFFF\s\-_\.]+)?\])?/,
			parent = arguments[1] || document,
			agent = search.match(tag),
			tag = agent[1] || "*",
			attribute = agent[3],
			type =  agent[4]+"=",
			value = agent[5],
			ieAttrFix = {
				"class": "className",
				"for": "htmlFor"
			},
			returnElements = [],
			//IE5.5不支持"*"
			elements = (tag === "*" && parent.all)? parent.all : parent.getElementsByTagName(tag),
			length = elements.length;
			if((!!document.querySelectorAll) && type != "!="){
				elements = document.querySelectorAll(search);
				for(var i=0,length = elements.length;i < length;i++){
					returnElements.push(elements[i]);
				}
				return returnElements;
			}
			if(!+"\v1")
				attribute = ieAttrFix[attribute] ? ieAttrFix[attribute] : attribute;
			while(--length >= 0){
				var current = elements[length],
				_value = !+"\v1" ? current[attribute] : current.getAttribute(attribute);
				if(typeof _value === "string" && _value.length > 0){
					if(!!value){
						var condition =
						type === "=" ?//完全等于
						_value === value :
						type === "!=" ?//不等于
						_value != value :
						type === "*=" ?//包含
						_value.indexOf(value) >= 0 :
						type === "~=" ?//匹配当中的某个单词，如<span class="red bold">警告</span>
						(" " + _value + " ").indexOf(value) >= 0:
						type === "^=" ?//以XX开头
						_value.indexOf(value) === 0 :
						type === "$=" ?//以XX结尾
						_value.slice(-_value.length) === value:
						type === "|=" ?//匹配属性值为XX或以XX-打头的元素
						_value === value ||  _value.substring(0,value.length+1) === value+"-" :
						false;
						condition && returnElements.push(current);
					}else{
						returnElements.push(current)
					}
				}
			}
			return returnElements;
		},
		//单选css选择器 IE8以上
		$one:function(selector,parent){
			if(document.querySelector){
				parent = parent || this.doc;
				return parent.querySelector(selector);
			}
		},
		//多选css选择器 IE8以上
		$all:function(selector,parent){
			if(document.querySelectorAll){
				parent = parent || this.doc;
				return parent.querySelectorAll(selector);
			}
		},
		ready:function(fn){
			this._initReady();
			if(isFun(fn)){
			  if(this.isReady){
				fn();
			  }else{
				this.readyfn.push(fn);
			  }
			}
		 },
		 _fireReady:function(){
			if (this.isReady) return;
			this.isReady = true;
			for(var i=0,n=this.readyfn.length;i<n;i++){
			  var fn = this.readyfn[i];
			  fn();
			}
			this.readyfn.length = 0;//清空事件
		  },
		  _initReady:function(){
			var _this = this;
			if (document.addEventListener) {
			  document.addEventListener( "DOMContentLoaded", function(){
				document.removeEventListener( "DOMContentLoaded", arguments.callee, false );//清除加载函数
				_this._fireReady();
			  }, false );
			}else{
			  if (document.getElementById) {
				document.write('<script id="ie-domReady" defer="defer" src="//:"><\/script>');
				this.$id("ie-domReady").onreadystatechange = function() {
				  if (this.readyState === "complete") {
					_this._fireReady();
					this.onreadystatechange = null;
					this.parentNode.removeChild(this);
				  }
				};
			  }
			}
		 },
		attr: function(el,name, value){
			if (typeof(value) == 'undefined') {
				switch (name) {
					case 'class':
						return el.className;
					case 'style':
						return el.style.cssText;
					default:
						return el.getAttribute(name);
				}
			} else {
				switch(name){
					case 'class':
						el.className = value;
						break;
					case 'style':
						el.style.cssText = value;
						break;
					default:
						el.setAttribute(name, value);
				};
				return el;
			}
		},
		prop: function(el, name, value) {
			if (typeof(value) == 'undefined') {
				return el[name];
			} else {
				el[name] = value;
				return el;
			}
		},
		remove: function(el){
			el.parentNode.removeChild(el);
			return el;
		},
		css: function (el, name, value) {
			if (typeof(value) == 'undefined') {
				if (name == 'opacity') {
					if (!+"\v1") {
						return el.filter && el.filter.indexOf("opacity=") >= 0 ? parseFloat(el.filter.match(/opacity=([^)]*)/)[1]) / 100 : 1;
					} else {
						return el.style.opacity ? parseFloat(el.style.opacity) : 1;
					}
				} else {
					function hyphenate(name) {
						return name.replace(/[A-Z]/g,
						function(match) {
							return '-' + match.toLowerCase();
						});
					}
					if (window.getComputedStyle) {
						return window.getComputedStyle(el, null).getPropertyValue(hyphenate(name));
					}
					if (document.defaultView && document.defaultView.getComputedStyle) {
						var computedStyle = document.defaultView.getComputedStyle(el, null);
						if (computedStyle){ return computedStyle.getPropertyValue(hyphenate(name))};
						if (name == "display"){return "none"};
					}
					if (el.currentStyle) {
						return el.currentStyle[name];
					}
					return el.style[name];
				}
			} else {
				if(name == 'opacity'){
					if(!+"\v1"){
						el.style.filter = 'Alpha(Opacity=' + value * 100 + ');';
						el.style.zoom = 1;
					} else {
						el.style.opacity = (value == 1? '': '' + value);
					}
				} else {
					if(typeof value == 'number'){value += 'px';}
					el.style[name] = value;
				}
				return el;
			}
		},
		text: function (el,value) {
			return this.prop(el,typeof(el.innerText) != 'undefined' ? 'innerText' : 'textContent', value);
		},
		html: function (el,value) {
			return this.prop(el,'innerHTML', value);
		},
		val: function(el, value){
			if(typeof(value) == 'undefined'){
				if(el.tagName.toLowerCase() == 'input'){
					switch(el.type){
						case 'checkbox':
							return el.checked ? true : false;
							break;
						case 'radio':
							return el.checked ? true : false;
							break;
					}
				}
				return el.value;
			} else {
				return this.prop(el,'value', value);
			}
		},
		show: function(el, val){
			this.css(el,'display', val ? val : 'block');
			return el;
		},
		hide: function(el){
			this.css(el,'display', 'none');
			return el;
		},
		toggle: function(el){
			var t = el.style.display == 'none' ? 'show' : 'hide';
			this[t](el);
			return el;
    	},
		hasClass: function(el, name){
			if(name && el.className){
				return this._regexpClass(name).test(el.className);
			}
			return false;
		},
		addClass: function(el, name){
			var arr = [];
			if(el.className){
				arr = el.className.split(' ');
				if(arr.indexOf(name)==-1) arr.push(name);
			} else {
				arr.push(name);
			}
			el.className = arr.join(' ');
			return el;
		},
		removeClass: function(el, name){
			if(el.className){
				var regexp = this._regexpClass(name);
				el.className = trim(el.className.replace(regexp, ''));
			}
			return el;
		},
		removeAttr: function(el, name){
			el.removeAttribute(name);
			return el;
		},
		removeCss: function(el, name){
			if(!name) {
				this.removeAttr(el,'style');
				return el;
			}
			var s = el.style;
			if(s.removeAttribute){
				s.removeAttribute(name);
			} else {
				name = name.replace(/([A-Z])/g, function(v){
					return '-' + v.toLowerCase();
				});
				s.removeProperty(name);
			}
			return el;
		},
		_regexpClass:function(s){
			//return new RegExp('\\b' + $String.trim(s) + '\\b', 'g');
			return new RegExp('(?:^|[ \\t\\r\\n\\f])' + s + '(?:$|[ \\t\\r\\n\\f])');
		},
		//事件绑定
		addEvent:addEvent,
		removeEvent:removeEvent,
		cookie:Cookie
	};
})();