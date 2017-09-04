var IdeaModel = (function(){

	var exports = {};
	
	function IdeaModel(){
		this.title = '';
		this.ideaText = '';
		this.industries = [];
		this.outcomes = [];
		this.elements = [];
		this.publishers = [];
		this.gallery = [];
		this.mainImg = '';
	}

	IdeaModel.prototype.initModel = function(obj){
		this.title = obj.title || '';
		this.ideaText = obj.ideaText || '';
		this.industries = obj.industries || [];
		this.outcomes = obj.outcomes || [];
		this.elements = obj.elements || [];
		this.publishers = obj.publishers || [];
		this.gallery = obj.gallery || [];
		this.mainImg = obj.gallery[0] || '';
	}

	IdeaModel.prototype.addTagToDb = function(tag, field, callback) {
		
		this[field].push(tag);

		$.ajax({
			url: '/api/tags/add_tag',
			method: 'POST',
			data: {
				name: tag,
				field: field
			},
			success: function(data){
				if(data.error){
					console.log(data.error);
				}
				callback(data);
			}
		});

	};

	// IdeaModel.prototype.updateIdeaModel = function(obj){
	// 	this.title = obj.title;
	// 	this.ideaText = obj.ideaText;
	// 	this.industries = obj.industries;
	// 	this.outcomes = obj.outcomes;
	// 	this.elements = obj.elements;
	// 	this.publishers = obj.publishers;
	// 	this.gallery = obj.gallery;
	// 	this.mainImg = obj.mainImg;
	// };

	exports = IdeaModel;
	return exports;

}());