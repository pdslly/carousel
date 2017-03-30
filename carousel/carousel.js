(function(win, doc){
	var defaultOpt = {
		duration: 3000,
		autoplay: true
	};

	function getCurrAbsPath(){
		var script, stack, extractUri = /((file|http|https):\/\/.*?)[^\/]+?.js/;

		if(script = doc.currentScript){
			return extractUri.exec(script.src)[1];
		}

		try{
			a.a = b.b = c.c;
		}catch(e){
			stack = e.stack || e.stacktrace || e.fileName || e.sourceURL;
		}
		if(stack){
			return extractUri.exec(stack)[1];
		}
	}

	var absPath = getCurrAbsPath();
	var css = doc.createElement("link");
	css.rel = "stylesheet";
	css.type = "text/css";
	css.href = absPath+"carousel.css";
	doc.head.appendChild(css);

	function checkEl(el){
		if(!el.nodeType || el.nodeType !== 1) return false;
		return true;
	}

	function assert(throwMsg){
		throw new Error("Carousel: "+throwMsg)
	}

	function mixin(){
		var args = [].slice.call(arguments), 
			i = 1, src, 
			deep = false,
			target = args[0], 
			len = args.length;

		if(len < 2){
			assert("arguments size can not letter than 2!");
			return;
		}
		if(typeof args[0] === "boolean"){
			deep = args;
			target = args[1];
			i = 2;
		}
		for(; i <= len; i++){
			src = args[i];
			if(target === src) break;
			for(var key in src){
				if( src.hasOwnProperty(key) ){
					if(typeof src[key] === "object" && deep){
						mixin(target[key] = src[key].length?[]:{}, src[key]);
					}else{
						target[key] = src[key];
					}
				}
			}
		}
		return target;
	}

	function checkOpt(opt){
		if(opt.resources && opt.resources.length){
			return true;
		}
		assert("options lack resources or resources is not array!");
		return false;
	}

	function carousel(option){
		this.$param = {current:null, tempE:null, eA:null, timer:null};
		this.$option = mixin(true, defaultOpt, option);
		if(!checkOpt(this.$option)) return;
	}

	function twoWayBind(res, eArr, param){
		var len = res.length, oF = oP = tO = {}, i;
		for(i = 0; i < len; i++){
			tO.el = eArr[i];
			tO.res = res[i];
			tO.next = {};
			tO.pre = oP;
			(i === 0)&&(tF = tO);
			oP = tO;
			tO = tO.next;
		}
		tF.pre = oP;
		oP.next = tF;
		param.current = tF;
	}

	var animCreator = {
		aaa: function(param, next, callback){
			var el = param.current.el, anim,
				lis = el.querySelectorAll("li"), split = 5,
				len = lis.length, i = 0, cName = "aaa-container-item";
			
			next.el.style.zIndex = 500;
			anim = Math.random()>0.5?" aaa-anim-one":" aaa-anim-two";
			for(; i < len; i++){
				setTimeout((function(index){
					return function(){
						lis[index].className += anim;
					}
				})(i), i*100)
			}

			setTimeout(function(){
				callback(param, cName, lis);
			}, i*100)
		},
		bbb: function(param, next, callback){
			var el = param.current.el, anim,
				lis = el.querySelectorAll("li"), split = 5,
				len = 5, i = 0, cName = lis[0].className;
			
			next.el.style.zIndex = 500;
			anim = Math.random()>0.5?" bbb-anim-one":" bbb-anim-two";
			for(; i < len; i++){
				setTimeout((function(index){
					return function(){
						lis[index].className = lis[index+split*1].className = lis[index+split*2].className = lis[index+split*3].className = lis[index+split*4].className += anim;
					}
				})(i), i*100)
			}

			setTimeout(function(){
				callback(param, cName, lis);
			}, i*100)
		},
		default: function(param, next, callback){
			var el = param.current.el,
				lis = el.querySelectorAll("li"),
				len = 1, i = 0, cName = lis[0].className;
			
			next.el.style.zIndex = 500;
			for(; i < len; i++){
				setTimeout((function(index){
					return function(){
						lis[index].className += " default-anim";
					}
				})(i), i*300)
			}

			setTimeout(function(){
				callback(param, cName, lis);
			}, i*300)
		}
	}

	var layerCreator = {
		aaa: function(res, param){
			var eContainer = doc.createElement("ul"), eItem,
				NAME = "aaa-container", split = 5,
				len = split, i = 0, w = param.width/split;

			eContainer.className = NAME;
			for(; i < len; i++){
				eItem = doc.createElement("li");
				eItem.className = NAME+"-item";
				eItem.style.cssText = "width:"+w+"px;height:"+param.height+"px;\
									 background:url("+res.url+");\
									 background-position:"+(-w*i)+"px 0;\
									 background-size:"+param.width+"px "+param.height+"px;";
				eContainer.appendChild(eItem);
			}
			return eContainer;
		},
		bbb: function(res, param){
			var eContainer = doc.createElement("ul"), eItem,
				NAME = "bbb-container", split = 5,
				len = split*split, i = 0, w = param.width/split, h = param.height/split;

			eContainer.className = NAME;
			for(; i < len; i++){
				eItem = doc.createElement("li");
				eItem.className = NAME+"-item";
				eItem.style.cssText = "width:"+w+"px;height:"+h+"px;\
									 background:url("+res.url+");\
									 background-position:"+(-w*(i%split))+"px "+(-h*(~~(i/split)))+"px;\
									 background-size:"+param.width+"px "+param.height+"px;";
				eContainer.appendChild(eItem);
			}
			return eContainer;
		},
		default: function(res, param){
			var eContainer = doc.createElement("ul"), eItem,
				NAME = "default-container";

			eContainer.className = NAME;
			eItem = doc.createElement("li");
			eItem.className = NAME+"-item";
			eItem.style.cssText = "width:"+param.width+"px;height:"+param.height+"px;\
								 background:url("+res.url+");\
								 background-size:"+param.width+"px "+param.height+"px;";
			eContainer.appendChild(eItem);

			return eContainer;
		}
	}

	carousel.prototype = {
		init: function(){
			clearInterval(this.$param.timer);
			this.$el.innerHTML = "";
			this.$param.width = this.$el.offsetWidth;
			this.$param.height = this.$el.offsetHeight;
			this.initLayer(this.$option.resources, this.$el, this.$param);
		},
		initLayer: function(res, el, param){
			var len = res.length, eItem, eArr = [], i = 0,
				eA = doc.createElement("a"),
				eRight = doc.createElement("a"),
				eLeft = doc.createElement("a"),
				eShow = doc.createElement("ul"),
				eCtrl = doc.createElement("div");

			eA.href = res[0].src;
			eRight.className = "ctrl-right";
			eLeft.className = "ctrl-left";
			eShow.className = "show-wrapper";
			eCtrl.className = "control-wrapper";
			eCtrl.appendChild(eLeft);
			eCtrl.appendChild(eRight);
			for(; i < len; i++){
				eItem = doc.createElement("li");
				eItem.className = "show-item";
				(i === 0)?((param.tempE = eItem).style.zIndex = 99999):eItem.style.zIndex = 0;
				eItem.appendChild(layerCreator[res[i].animMode || "default"](res[i], param));
				eArr.push(eItem);
				eShow.appendChild(eItem);
			}
			eA.appendChild(eShow);
			el.appendChild(eA);
			el.appendChild(eCtrl);
			param.eA = eA;
			twoWayBind(res, eArr, param);
			this.initControl(eLeft, eRight);
		},
		initControl: function(eL, eR){
			var param = this.$param, option = this.$option;

			if(option.autoplay){
				param.timer = setInterval(next, option.duration);
				this.$el.addEventListener("mouseover", function(){
					clearInterval(param.timer);
				})
				this.$el.addEventListener("mouseout", function(){
					clearInterval(param.timer);
					param.timer = setInterval(next, option.duration);
				})
			}

			function pre(){
				animCreator[param.current.res.animMode || "default"](param, param.current.pre, function(param, cName, els){
					var len = els.length, i = 0;
					param.current = param.current.pre;
					if(param.tempE) param.tempE.style.zIndex = 0;
					param.current.el.style.zIndex = "99999";
					param.tempE = param.current.el;
					param.eA.href = param.current.res.src;
					for(; i < len; i++){
						els[i].className = cName;
					}
				});
			}

			function next(){
				animCreator[param.current.res.animMode || "default"](param, param.current.next, function(param, cName, els){
					var len = els.length, i = 0;
					param.current = param.current.next;
					if(param.tempE) param.tempE.style.zIndex = 0;
					param.current.el.style.zIndex = "99999";
					param.tempE = param.current.el;
					param.eA.href = param.current.res.src;
					for(; i < len; i++){
						els[i].className = cName;
					}
				});
			}

			eL.addEventListener("click", pre);
			eR.addEventListener("click", next);
		}
	}
	
	carousel.bind = function(el){
		if(!checkEl(el)){
			assert("binded el is not node!");
			return;
		}
		this.prototype.$el = el;
	}

	window.Carousel = carousel;
})(window, document)
