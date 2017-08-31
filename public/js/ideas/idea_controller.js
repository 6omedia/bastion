var IdeaController = (function(){

	var exports = {};
	
	function IdeaController(model, view, imageLibrary){
		var thisController = this;
		this.model = model;
		this.view = view;
		this.setClickHandlers(imageLibrary);
		imageLibrary.onSelectImage(function(img){
			thisController.model.gallery.push(img);
			thisController.view.updateImgGallery(thisController.model.gallery);
		});
	}

	IdeaController.prototype.setClickHandlers = function(imgLibrary) {
		var thisIdea = this;
		this.view.buttons.addImgToGallery.on('click', function(){
			imgLibrary.openLibrary(this);
		});
		this.view.buttons.saveIdea.on('click', function(){
			
		});
		$('#img_gallery').on('click', '.overlay', function(){
			console.log($(this).parent());
			thisIdea.removeImg($(this).parent().index());
		});
	};

	IdeaController.prototype.removeImg = function(index){
		this.model.gallery.splice(index, 1);
		this.view.updateImgGallery(this.model.gallery);
	};	

	exports = IdeaController;
	return exports;

}());