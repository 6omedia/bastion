(function(YeahAutocomplete, ImageLibrary, IdeaController, IdeaModel, IdeaView){

	function Idea(IdeaController, IdeaModel, IdeaView){

		this.IdeaView = new IdeaView();
		this.IdeaModel = new IdeaModel();
		this.controller = new IdeaController(
			this.IdeaModel, 
			this.IdeaView, 
			new ImageLibrary(this.IdeaView.imgLibContainer),
			YeahAutocomplete
		);

	}

	var idea = new Idea(IdeaController, IdeaModel, IdeaView);

}(YeahAutocomplete, imageLibrary.ImageLibrary, IdeaController, IdeaModel, IdeaView));