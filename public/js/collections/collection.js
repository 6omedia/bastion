(function(YeahAutocomplete, ImageLibrary){

	function slugify(url){
		return url.toString().toLowerCase()
		    .replace(/\s+/g, '-')           // Replace spaces with -
		    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
		    .replace(/^-+/, '')             // Trim - from start of text
		    .replace(/-+$/, '');            // Trim - from end of text
	}

	////////////////////////////////////////////////////////////////////

	function Model(obj){
		this.collection = {
			title: obj.collection.title,
			description: obj.collection.description,
			img: obj.collection.img,
			ideas: obj.collection.ideas
		},
		this.addIdeas = obj.addIdeas;
	}

	function View(){
		this.collection = {
			titleInput: $('#q_title'),
			slugBox: $('#slugBox'),
			descInput: $('#q_desc'),
			imgOverlay: $('#collectionImgli .overlay'),
			featImg: $('#collectionImgli img'),
			ideaBoxes: $('.idea_box')
		};
		this.addIdeas = {
			search: $('#idea_search'),
			ul: $('.side_view ul'),
			lis: $('.side_view ul li'),
			imgs: $('.side_view ul li img')
		};
	}
	View.prototype.setImage = function(img){
		this.collection.featImg.attr('src', '/static/uploads/' + img);
		this.collection.imgOverlay.removeClass('no_img');
		this.collection.imgOverlay.addClass('removeImg').text('Change Image');
	};
	View.prototype.unsetImage = function(){
		this.collection.featImg.attr('src', '/static/img/placeholder.png');
		this.collection.imgOverlay.removeClass('removeImg');
		this.collection.imgOverlay.addClass('no_img').text('Upload Image');
	};
	View.prototype.refreshIdeas = function(){

	};
	View.prototype.refreshAllIdeas = function(){

	};

	function Collection(Model, View){

		var thisColl = this;
		var imgLibrary = new ImageLibrary($('#image_library_modal'));

		this.view = new View();
		this.model = new Model({
			collection: {
				title: '',
				description: '',
				img: '',
				ideas: thisColl.getViewIdeas(thisColl.view.collection.ideaBoxes)
			},
			addIdeas: thisColl.getViewIdeas(thisColl.view.addIdeas.lis)
		});

		/*** events ***/

		// slugify
		this.view.collection.titleInput.on('blur', function(){
			thisColl.view.collection.slugBox.text('bastion.com/collection/view/' + slugify($(this).val()));
		});

		// collection image
		this.view.collection.imgOverlay.on('click', function(){
			imgLibrary.openLibrary(this);
		});

		imgLibrary.onSelectImage(function(img){
			thisColl.model.collection.img = img;
			thisColl.view.setImage(img);
		});

		// ideas click to remove

		// all ideas search

		// all ideas click to add

		// form

	}

	Collection.prototype.getViewIdeas = function(ideaBoxes) {
		var ideas = [];
		for(i=0; i<ideaBoxes.length; i++){
			ideas.push($(ideaBoxes[i]).data('ideaid'));
		}
		return ideas;
	};

	var collection = new Collection(Model, View);

}(YeahAutocomplete, imageLibrary.ImageLibrary));