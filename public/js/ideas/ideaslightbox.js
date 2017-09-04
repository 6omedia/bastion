(function(LightBox){

	var lightBox = new LightBox();

	$('.cb_gallery .lightBoxOverlay').on('click', function(e){
		console.log($(this).parent().index());
		lightBox.openImg($(this).parent().index());
	});

}(LightBox));