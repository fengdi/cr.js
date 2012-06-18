;;(function(HOST, NS){
var opt = Object.prototype.toString,
doc = HOST.document,
isFun = function(f){return opt.call(f)==="[object Function]";},
isObj = function(o){return opt.call(o)==="[object Object]";},
parseJSON = function( data ) {
	if ( typeof data !== "string" || !data ) {
		return null;
	}
	data = data.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "" );
	if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
		.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
		.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
		return HOST.JSON && HOST.JSON.parse ?
				HOST.JSON.parse( data ) :
			(new Function("return " + data))();
	}
},
param = function(obj){
	var tarr = [];
	for(k in obj){
		tarr.push(k+"="+obj[k]);
	}
	return tarr.join('&');
},
mix = function (target,src) {
	for (var it in src) {
		target[it] = src[it];
	}
	return target;
};
HOST[NS] = {
	jsonp:function(url,data,callback){
		HOST.jsonp_callback = HOST.jsonp_callback || {};
		var head = doc.getElementsByTagName('head')[0],
			script = doc.createElement('script'),
			_this = this,
			p = isObj(data)? param(data) : data,
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
			setTimeout(function(){
				delete HOST.jsonp_callback[fun.id];
				script.parentNode.removeChild(script);
			}, 100);
		};
		script.src = url+'?callback='+fun.name+'&'+p;
	},
	get:function(url,data,callback,format){
		format = format||"text";
		if(!isFun(data)){
			return this.ajax(url,{"data":data,success:callback,"format":format});
		}else{
			return this.ajax(url,{"data":null,success:data,"format":callback});
		}
	},
	post:function(url,data,callback,format){
		format = format||"text";
		if(!isFun(data)){
			return this.ajax(url,{method:"post","data":data,success:callback,"format":format});
		}else{
			return this.ajax(url,{method:"post","data":null,success:data,"format":callback});
		}
	},
	ajax:function(url,options){
		xhr = this._createXhr();
		var op = mix({
            method:  'get',
            async:   true,
            data:    null,
            format:  'text',
            encode:  'UTF-8',
            success: function(){},
            failure: function(){},
			whatever:function(){}
        }, options || {});
		if(isObj(op.data)){
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
		if(HOST.XMLHttpRequest)return new XMLHttpRequest(); 
		var msxml = [           
		"MSXML2.XMLHTTP.6.0",
		"MSXML2.XMLHTTP.4.0",   
		"MSXML2.XMLHTTP.3.0",   
		"MSXML2.XMLHTTP.2.6",   
		"MSXML2.XMLHTTP", 
		"Microsoft.XMLHTTP",   
		"MSXML.XMLHTTP" 
		];
		for(var i=0;i <msxml.length;i++){
			try{
				//console.log(msxml[i]);
				return new ActiveXObject(msxml[i]); 
			}catch(e){}
		}
		return;
	},
	_onStateChange:function(xhr,op){
		if(xhr.readyState == 4){
			xhr.onreadystatechange = function(){};
			var s = xhr.status, tmp = xhr;
			if(!op.success) return;
			if(op.whatever) op.whatever(xhr);
			if(!!s && s>= 200 && s < 300){
				if(typeof(op.format) == 'string'){
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
};
})(this,'$Ajax');