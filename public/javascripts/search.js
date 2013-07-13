var $search = $('#search-panel');

//init the html5 sortable control
$('.sortable').sortable().bind('sortupdate', onSortUpdate);

setTimeout(function () {
	$search.addClass('slideLeft');

    $search.anima({x:'-98%'}, 400);

    $search.mouseover(function (e) {
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

    $search.mouseout(function (e) {
        
        if ($search.hasClass('slideLeft')) {
            $search.removeClass('slideLeft');

            $search.anima({x: 0}, 400);
        }
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

function doSearch (coords) {
	//make API call
    // /api/findFacilities?lat=39.8756116&lon=-86.27776399999999
    $.getJSON('/api/findFacilities', { lat: coords.latitude, lon: coords.longitude }, searchSuccess).fail(searchError);
}

function searchSuccess (data) {
    var clusterProvider = global.clusterProvider;
    var facilities = data.facilities,
        length = facilities.length;

    for (var i = 0 ; i < length ; i++) {
        facilities[i].latitude = parseFloat(facilities[i].latitude);
        facilities[i].longitude = parseFloat(facilities[i].longitude);
    }

    //add the markers in a cluster
    clusterProvider.addAll(facilities);

    clusterProvider.cluster();
}

function searchError (jqxhr, textStatus, error) {

}