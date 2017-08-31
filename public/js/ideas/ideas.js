(function(ImageLibrary, IdeaController, IdeaModel, IdeaView){

	function Idea(IdeaController, IdeaModel, IdeaView){
		this.IdeaModel = new IdeaModel();
		this.IdeaView = new IdeaView();
		this.controller = new IdeaController(this.IdeaModel, this.IdeaView, new ImageLibrary(this.IdeaView.imgLibContainer));
		// this.ideaForm = new Form();
	}

	var idea = new Idea(IdeaController, IdeaModel, IdeaView);

}(imageLibrary.ImageLibrary, IdeaController, IdeaModel, IdeaView));