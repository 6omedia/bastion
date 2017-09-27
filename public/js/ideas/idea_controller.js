var IdeaController = (function(){

	var exports = {};

	function slugify(url){
		return url.toString().toLowerCase()
		    .replace(/\s+/g, '-')           // Replace spaces with -
		    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
		    .replace(/^-+/, '')             // Trim - from start of text
		    .replace(/-+$/, '');            // Trim - from end of text
	}
	
	///////////////////////////////////////////////////////////////
	
	function IdeaController(model, view, imageLibrary, YeahAutocomplete){
		var thisController = this;
		this.model = model;
		this.view = view;

		this.model.initModel({
			title: this.view.inputs.title.val(),
			ideaText: this.view.inputs.ideaText.val(),
			industries: this.view.getRenderedTags('industries'),
			outcomes: this.view.getRenderedTags('outcomes'),
			elements: this.view.getRenderedTags('elements'),
			publishers: this.view.getRenderedTags('publishers'),
			gallery: this.view.getRenderedImgs(),
			mainImg: ''
		});

		this.setClickHandlers(imageLibrary);
		imageLibrary.onSelectImage(function(img){
			thisController.model.gallery.push(img);
			thisController.view.updateImgGallery(thisController.model.gallery);
		});

		// Auto Completes

		var industryAutocomplete = new YeahAutocomplete({
			input: 'auto_industries',
			allowFreeType: true,
			dataUrl: '/api/tags/search/industries',
			method: 'GET',
			arrName: 'tags',
			property: 'name'
		});

		var outcomeAutocomplete = new YeahAutocomplete({
			input: 'auto_outcomes',
			allowFreeType: true,
			dataUrl: '/api/tags/search/outcomes',
			method: 'GET',
			arrName: 'tags',
			property: 'name'
		});

		var elementAutocomplete = new YeahAutocomplete({
			input: 'auto_elements',
			allowFreeType: true,
			dataUrl: '/api/tags/search/elements',
			method: 'GET',
			arrName: 'tags',
			property: 'name'
		});

		var publisherAutocomplete = new YeahAutocomplete({
			input: 'auto_publishers',
			allowFreeType: true,
			dataUrl: '/api/tags/search/publishers',
			method: 'GET',
			arrName: 'tags',
			property: 'name'
		});

	}

	IdeaController.prototype.setClickHandlers = function(imgLibrary) {

		var thisIdea = this;

		this.view.inputs.title.on('blur', function(){
			thisIdea.view.slugBox.text('bastion.com/idea/view/' + slugify($(this).val()));
		});

		// GALLARY

		this.view.buttons.addImgToGallery.on('click', function(){
			imgLibrary.openLibrary(this);
		});

		$('#img_gallery').on('click', '.overlay', function(){
			thisIdea.removeImg($(this).parent().index());
		});

		// TAGS

		$('.side .plus').on('click', function(){
			thisIdea.addTag($(this).prev().val(), $(this).data('field'));
		});

		$('.side ul').on('click', 'div', function(){
			thisIdea.removeTag($(this).parent().index(), $(this).data('field'));
		});

		// FORM

		this.view.buttons.saveIdea.on('click', function(){
			$(this).addClass('loading');
			thisIdea.saveIdea();
		});

		this.view.buttons.updateIdea.on('click', function(){
			$(this).addClass('loading');
			thisIdea.updateIdea($(this).data('slug'));
		});

	};

	IdeaController.prototype.removeImg = function(index){
		this.model.gallery.splice(index, 1);
		this.view.updateImgGallery(this.model.gallery);
	};	

	IdeaController.prototype.addTag = function(tag, field){
		
		if(tag == ''){
			return;
		}

		var thisIdea = this;
		this.model.addTagToDb(tag, field, function(data){
			thisIdea.view.addTagToUl(tag, field);
		});

	};

	IdeaController.prototype.removeTag = function(index, field){
		this.model[field].splice(index, 1);
		this.view.updateTagList(this.model[field], field);
	};

	IdeaController.prototype.isFormValid = function(){

		this.model.title = this.view.inputs.title.val();
		this.model.ideaText = this.view.inputs.ideaText.val();

		this.view.resetForm();

		var valid = true;

		if(this.model.ideaText == ''){
			valid = false;
			this.view.inputs.ideaText.addClass('invalid');
		}

		if(this.model.title == ''){
			valid = false;
			this.view.inputs.title.addClass('invalid');
		}

		return valid;

	};

	IdeaController.prototype.saveIdea = function(){
		
		var thisImgLib = this;

		this.model.title = this.view.inputs.title.val();
		this.model.ideaText = this.view.inputs.ideaText.val();

		var dataObj = {
			title: this.model.title,
			img_src: this.model.gallery[0] || 'none.png',
			img_gallery: this.model.gallery,
	        text: this.model.ideaText,
	        industries: this.model.industries,
	        outcomes: this.model.outcomes,
	        elements: this.model.elements,
	        publishers: this.model.publishers
		};

		console.log('obj ', dataObj);

		if(this.isFormValid()){

			$.ajax({
				url: '/ideas/new',
				method: 'POST',
				data: dataObj,
				success: function(data){
					console.log(data);
					thisImgLib.view.buttons.saveIdea.removeClass('loading');
					thisImgLib.view.buttons.saveIdea.remove();
					thisImgLib.view.msg_tick.show();
					$('#error').text('Idea Created').addClass('display_success');
				},
				error: function(a){
					console.log(a.responseJSON);
					thisImgLib.view.buttons.saveIdea.removeClass('loading');
					$('#error').text(a.responseJSON.error).addClass('display_error');
				}
			});
			// send form
				// turn button to tick
				// success display message an option to view ideas or add another
				

		}else{
			this.view.buttons.saveIdea.removeClass('loading');
		}

	};

	IdeaController.prototype.updateIdea = function(slug){

		var thisImgLib = this;

		this.model.title = this.view.inputs.title.val();
		this.model.ideaText = this.view.inputs.ideaText.val();

		var dataObj = {
			title: this.model.title,
			img_src: this.model.gallery[0] || 'none.png',
			img_gallery: this.model.gallery,
	        text: this.model.ideaText,
	        industries: this.model.industries,
	        outcomes: this.model.outcomes,
	        elements: this.model.elements,
	        publishers: this.model.publishers
		};

		if(this.isFormValid()){

			$.ajax({
				url: '/ideas/update/' + slug,
				method: 'POST',
				data: dataObj,
				success: function(data){
					console.log(data);
					thisImgLib.view.buttons.updateIdea.removeClass('loading');
					thisImgLib.view.buttons.updateIdea.remove();
					thisImgLib.view.msg_tick.show();
					$('#error').text('Idea Updated').addClass('display_success');
					$('#theTitle').text(thisImgLib.model.title);
					$('.viewLink').text(thisImgLib.model.title).attr('href', '/ideas/view/' + data.idea.slug);
				},
				error: function(a){
					console.log(a.responseJSON);
					thisImgLib.view.buttons.updateIdea.removeClass('loading');
					$('#error').text(a.responseJSON.error).addClass('display_error');
				}
			});

		}else{
			this.view.buttons.updateIdea.removeClass('loading');
		}

	};

	exports = IdeaController;
	return exports;

}());