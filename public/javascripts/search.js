var $search = $('#search-panel-div');

setTimeout(function () {
	$search.addClass('slideLeft');

    $search.anima({x:'-98%'}, 400);

    $search.click(function (e) {
    	if ($(e.target).attr('type') === 'range') {
    		return false;
    	}

    	var value = '-98%';

    	if ($search.hasClass('slideLeft')) {
    		$search.removeClass('slideLeft');
    		value = '0';
    	} else {
    		$search.addClass('slideLeft');
    	}

    	$search.anima({x: value}, 400);
	});

	$('#searchBtn').click(doSearch);
}, 1500);



function doSearch () {
	var proximity = $('#proximity').val(),
		price = $('#proximity').val(),
		overall = $('#proximity').val(),
		clean = $('#proximity').val(),
		doctor = $('#proximity').val(),
		nurse = $('#proximity').val();

		//make API call
}

function searchSuccess () {

}

function searchError () {

}