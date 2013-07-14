//just a global namespace
var globalNS = {
	
};

//jQuery ui is inserting some loader div?? Remove it. Ugh.
$(document).ready(function() {
  	$(this).find('.ui-loader').remove();
});