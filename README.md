# 一款简单的轮播插件
## 使用方法
```javascript
    var el = document.querySelector("div#show");
		var opt = {
			duration: 3000,
			autoplay: true,
			resources: [{
				url: "./imgs/01.jpg",
				src: "#0",
				animMode: "bbb"
			},{
				url: "./imgs/02.jpg",
				src: "#1",
				animMode: "default"
			},{
				url: "./imgs/03.jpg",
				src: "#2",
				animMode: "bbb"
			},{
				url: "./imgs/04.jpg",
				src: "#3",
				animMode: "aaa"
			},{
				url: "./imgs/05.jpg",
				src: "#3",
				animMode: "default"
			},{
				url: "./imgs/06.jpg",
				src: "#3",
				animMode: "bbb"
			},{
				url: "./imgs/07.jpg",
				src: "#3",
				animMode: "aaa"
			}] 	
		};
		Carousel.bind(el);
		var caro = new Carousel(opt);
		caro.init();
```
