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

    	if ($search.hasClass('slideLeft')) {
    		$search.removeClass('slideLeft');
    	}

    	$search.anima({x: '0'}, 400);
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
    $.getJSON('/api/findFacilities', { lat: coords.latitude, lon: coords.longitude }, searchSuccess).fail(searchError);
}

function searchSuccess (data) {
    var clusterProvider = globalNS.clusterProvider;
    var facilities = data.facilities,
        length = facilities.length,
        markers = [],
        parseFloat = window.parseFloat;

    for (var i = 0 ; i < length ; i++) {
        var facility = facilities[i];

        var marker = {
            latitude: parseFloat(facility.latitude), 
            longitude: parseFloat(facility.longitude),
            value: parseFloat(facility.cluster)
        };

        markers.push(marker);
    }

    clusterProvider.destroy();

    //add the markers in a cluster
    clusterProvider.addAll(markers);

    clusterProvider.cluster();
}

function searchError (jqxhr, textStatus, error) {

}

