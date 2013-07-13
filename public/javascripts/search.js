var $search = $('#search-panel');

//init the html5 sortable control
$('.sortable').sortable().bind('sortupdate', onSortOrderUpdate);

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

function onSortOrderUpdate () {
    doSearch(globalNS.map.center);
}

function getSortOrder () {
    var liItems = $('#priority-list').children();
    var order = [];

    liItems.each(function (index, liItem) {
        order.push($(liItem).data('value'));
    });

    return order.join(',');
}

function doSearch (coords) {
	//make API call
    $.getJSON('/api/findFacilities', { lat: coords.latitude, lon: coords.longitude, sort: getSortOrder() }, searchSuccess).fail(searchError);
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
            value: parseFloat(facility.cluster),
            address: facility.address + ', ' + facility.city + ', ' + facility.state + ', ' + facility.zip
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

