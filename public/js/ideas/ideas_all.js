(function(PopUp, YeahAutoComplete){

	function Model(ideas){
		this.ideas = ideas || [];
	}
	Model.prototype.removeFromDb = function(ideaSlug, callback) {
		
		var thisModel = this;

		$.ajax({
			url: '/ideas/' + ideaSlug,
			method: 'DELETE',
			success: function(data){
				thisModel.ideas = data.ideas;
				callback(thisModel.ideas);
			},
			error: function(a, b, c){
				console.log(a, b, c);
			}
		});

	};

	function View(){
		this.deleteBtn = $('.delete');
		this.ideas = $('#ideas');
	}
	View.prototype.startLoading = function(){
		this.ideas.addClass('bigLoading');
	};
	View.prototype.stopLoading = function(){
		this.ideas.removeClass('bigLoading');
	};
	View.prototype.refreshIdeas = function(ideas){

		this.ideas.empty();

		var string = '<div class="cont">';

		for(i=0; i<ideas.length; i++){
			string += '<div class="idea_box">';
			string += '<h2>' + ideas[i].title + '</h2>';
			string += '<img src="/static/uploads/' + ideas[i].img_src + '">';
			string += '<div class="actions">';
			string += '<a href="/ideas/view/' + ideas[i].slug + '" class="View">View</a>';
			string += '<a href="/ideas/view/' + ideas[i].slug + '?mode=edit" class="Edit">Edit</a>';
			string += '<span class="delete" data-slug="' + ideas[i].slug + '">Delete</span>';
			string += '</div>';
			string += '</div>';
		}

		string += '</div>';
		this.ideas.append(string);

	};

	function IdeaManager(Model, View){
		var thisIdeaMan = this;
		this.model = new Model();
		this.view = new View();
		this.view.ideas.on('click', '.delete', function(){
			
			var slug = $(this).data('slug');

			var areYouSure = new PopUp(function(){
					thisIdeaMan.view.startLoading();
					thisIdeaMan.model.removeFromDb(slug, function(ideas){
						if(ideas){
							thisIdeaMan.view.refreshIdeas(ideas);
							thisIdeaMan.view.stopLoading();
						}
						thisIdeaMan.view.stopLoading();
					});
					this.popDown();
				},
				function(){
					this.popDown();
				});
			
			areYouSure.popUp('Are you sure you want to remove this idea?');

		});

		var industryAutocomplete = new YeahAutocomplete('auto_industries', true);
		
	}

	IdeaManager.prototype.applyAutoComplete = function(){



		// fromAutocomplete.element.addEventListener("resultsLoaded", function(e){

		// 	fromAutocomplete.displayResults(JSON.parse(e.detail.data).cities, 'city');
			
		// }, false);

	};

	var idea = new IdeaManager(Model, View);

}(PopUp, YeahAutocomplete));