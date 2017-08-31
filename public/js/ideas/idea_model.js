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

	exports = IdeaModel;
	return exports;

}());