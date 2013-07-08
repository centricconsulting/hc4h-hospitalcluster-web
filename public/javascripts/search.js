var $search = $('#search-panel');

//init the html5 sortable control
$('.sortable').sortable().bind('sortupdate', onSortUpdate);

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
}, 1500);

function onSortUpdate (e, ui) {
    var $currentTarget = $(e.currentTarget);

    var liItems = $currentTarget.children();
    var order = [];

    liItems.each(function (index, liItem) {
        order.push($(liItem).data('value'));
    });

    console.log(order);
}

function doSearch () {
	//make API call
}

function searchSuccess () {

}

function searchError () {

}