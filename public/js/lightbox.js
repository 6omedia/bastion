/*

	CSS

	.cb_lightbox {
	    position: fixed;
	    width: 100%;
	    height: 100%;
	    background: rgba(0,0,0,0.8);
	    top: 0px;
	    text-align: center;
	    padding-top: 110px;
	    z-index: 2;
	}

	.cb_lightbox img {
	    max-width: 80%;
	}

	.cb_lightbox .box {
	    display: inline-block;
	}

	.cb_lightbox .left,
	.cb_lightbox .right {
	    width: 25px;
	    height: 35px;
	    display: inline-block;
	    background: darkorange;
	}

	.cb_lightbox .right,
	.cb_lightbox .left {
	    filter: invert();
	    background-size: contain;
	}   

	.cb_lightbox .left {
	    background: url(../img/prev.png) no-repeat 50%;
	}

	.cb_lightbox .right {
	    background: url(../img/next.png) no-repeat 50%;
	}

	.cb_gallerythumbnails {
	    padding: 0px;
	    margin: 10px auto;
	    max-width: 600px;
	}

	.cb_gallerythumbnails li {
	    display: inline-block;
	    width: 45px;
	}

	.cb_current_img img {
	    box-shadow: 0px 0px 5px rgba(255, 255, 238, 0.69);
	    border: solid 1px #fff;
	}

*/

var LightBox = (function(){

	function LightBox(){
		var thisLb = this;
		this.imgs = $('.cb_gallery img');
		this.imgIndex = null;
		this.modal = $('<div class="cb_lightbox"></div>');
		this.box = $('<div class="box"></div>');
		this.left = $('<div class="left">');
		this.right = $('<div class="right">');

		this.image = $('<img src="">');

		this.left.on('click', function(){
			thisLb.prev();
		});

		this.right.on('click', function(){
			thisLb.next();
		});

		this.box.append(this.left);
		this.box.append(this.image);
		this.box.append(this.right);
		this.thumbnails = this.thumbnails();
		this.box.append(this.thumbnails);
		this.modal.append(this.box);
		this.modal.on('click', function(e){
			if($(e.target).is($('.left')) || $(e.target).is($('.right')) || $(e.target).is($('img')) ){
				return e.preventDefault();
			}
			$(this).hide();
		});
		this.modal.hide();
		$('body').append(this.modal);
	}

	LightBox.prototype.thumbnails = function(){

		var thisLb = this;

		var ul = $('<ul class="list cb_gallerythumbnails"></ul>');

		for(i=0; i<thisLb.imgs.length; i++){
			ul.append('<li><img src="' + $(thisLb.imgs[i]).attr('src') + '"></li>');
		}

		ul.children('li').on('click', function(){
			thisLb.openImg($(this).index());
		});

		return ul;

	};

	LightBox.prototype.prev = function(){

		if(this.imgIndex > 0){
			this.openImg(this.imgIndex - 1);
		}

	};

	LightBox.prototype.next = function(){

		if(this.imgIndex <= this.imgs.length - 1){
			this.openImg(this.imgIndex + 1);
		}

	};

	LightBox.prototype.openImg = function(index){

		this.imgIndex = index;

		if(this.imgIndex <= 0){
			this.left.hide();
		}else{
			this.left.show();
		}

		if(this.imgIndex >= this.imgs.length - 1){
			this.right.hide();
		}else{
			this.right.show();
		}

		var lis = $(this.thumbnails).children();
		lis.removeClass('cb_current_img');

		var currentImg = lis.get(this.imgIndex);

		$(currentImg).addClass('cb_current_img');

		this.image.attr('src', $(this.imgs[this.imgIndex]).attr('src'));
		this.modal.fadeIn(300);

	};

	return LightBox;

}());