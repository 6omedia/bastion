var IdeaView = (function(){

	var exports = {};
	
	function IdeaView(){
		this.imgLibContainer = $('#image_library_modal'); 
		this.buttons = {
			addImgToGallery: $('#btn_addimgtogallery'),
			saveIdea: $('#btn_saveIdea')
		};
		this.inputs = {
			title: $('#q_title'),
			ideaText: $('#q_ideatext'),
			industry: $('#q_industry'),
			outcome: $('#q_outcome'),
			element: $('#q_ideatext'),
			publisher: $('#q_ideatext')
		};
		this.imgGallery = $('#img_gallery');
	}

	IdeaView.prototype.updateImgGallery = function(imgs){
		this.imgGallery.empty();
		for(i=0; i<imgs.length; i++){
			var img = '<img src="/static/uploads/' + imgs[i] + '">';
			var removeOverlay = '<div class="overlay">Remove</div>';
			this.imgGallery.append('<li>' + img + removeOverlay + '</li>');
		}
	};

	exports = IdeaView;
	return exports;

}());