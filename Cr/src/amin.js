
var transition = '-webkit-transition';

function Anim(elem,config,callback){
  this.elem = elem;
  this.config = config;///
  this.callback = callback || function(){};
  this.timer = null;
  this.isAnim = !!0;
}
Anim.prototype = {
  run:function(){
	//如果正在动画就不必再次动画
	if(this.isAnim)return this;

    var s = this.elem.style,
    self = this,
    tconfig = this._transitionConfig(this.config);
    console.log(tconfig);

    if(tconfig){
	    s[transition+'-property'] = tconfig.p;
	    s[transition+'-duration'] = tconfig.d;
	    s[transition+'-timing-function'] = tconfig.e;
	    s[transition+'-delay'] = tconfig.l;

	    s.cssText += ';' + tconfig.s;

	    this._cleartimer();
	    this.isAnim = !!1;
	    this.timer = setTimeout(function(){
	      s[transition] = '';
	      self.isAnim = !!0;
	      self.callback.call(this);
	    }, tconfig.time);
    }
    return this;
  },
  _transitionConfig:function(tran){
	  var time=0,self = this;
	  if($.type(tran, "object")){
		  time = self._secondunit(tran.duration) + self._secondunit(tran.delay);
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
			  t = self._secondunit(c.duration) + self._secondunit(c.delay);
			  if(time < t)time = t;
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
  _secondunit:function(s){
    return (/s$/.test(s)) ? 1000 * parseFloat(s) : parseFloat(s);
  },
  _cleartimer:function(){
    if(this.timer){
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  stop:function(c){
    this._cleartimer();
    this.isAnim = !!0;

    switch(c){
      case 1:
      break;
      case 0:
      break;
      case -1:
      break;
    }

    this.elem.style[transition] = '';

    return this;
  }
};


/* 动画测试 */