var IdeaView = (function(){

	var exports = {};
	
	function IdeaView(){
		this.imgLibContainer = $('#image_library_modal'); 
		this.buttons = {
			addImgToGallery: $('#btn_addimgtogallery'),
			saveIdea: $('#btn_saveIdea'),
			updateIdea: $('#btn_updateIdea')
		};
		this.inputs = {
			title: $('#q_title'),
			ideaText: $('#q_ideaText'),
			industries: $('#auto_industries'),
			outcomes: $('#auto_outcomes'),
			elements: $('#auto_elements'),
			publishers: $('#auto_publishers')
		};
		this.slugBox = $('#slugBox');
		this.tagLists = {
			industries: $('#industry_list'),
			outcomes: $('#outcome_list'),
			elements: $('#element_list'),
			publishers: $('#publisher_list')
		};
		this.imgGallery = $('#img_gallery');
		this.msg_tick = $('.msg_tick');
	}

	IdeaView.prototype.getRenderedTags = function(field){

		var tags = [];
		var renderedTags = this.tagLists[field].children();

		for(i=0; i<renderedTags.length; i++){
			var span = $(renderedTags[i]).children()[0];
			tags.push($(span).text());
		}

		return tags;

	};

	IdeaView.prototype.getRenderedImgs = function(){

		var imgs = [];
		var renderedImgs = this.imgGallery.find('img');

		for(i=0; i<renderedImgs.length; i++){
			imgs.push($(renderedImgs[i]).data('imgsrc'));
		}

		return imgs;

	};

	IdeaView.prototype.updateImgGallery = function(imgs){
		this.imgGallery.empty();
		for(i=0; i<imgs.length; i++){
			var img = '<img src="/static/uploads/' + imgs[i] + '">';
			var removeOverlay = '<div class="overlay">Remove</div>';
			this.imgGallery.append('<li>' + img + removeOverlay + '</li>');
		}
	};

	IdeaView.prototype.updateTagList = function(tags, field){
		this.tagLists[field].empty();
		for(i=0; i<tags.length; i++){
			this.tagLists[field].append(
				'<li><span>' + tags[i] + '</span><div data-field="' + field + '">x</div></li>'
				);
		}
	};

	IdeaView.prototype.addTagToUl = function(tag, field){
		this.tagLists[field].append(
			'<li><span>' + tag + '</span><div data-field="' + field + '">x</div></li>'
		);
		this.inputs[field].val('');
	};

	IdeaView.prototype.resetForm = function(){
		this.inputs.title.removeClass('invalid');
		this.inputs.ideaText.removeClass('invalid');
	};

	exports = IdeaView;
	return exports;

}());