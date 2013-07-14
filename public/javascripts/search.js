var $search = $('#search-panel');
var $sideBar = $('#sideBar');

var $sortable = $('.sortable');
$sortable.sortable();
$sortable.disableSelection();
$sortable.bind("sortstop", function (event, ui) {
  $sortable.listview('refresh');

  onSortOrderUpdate();
});

setTimeout(function () {
	$search.addClass('slideLeft');

    $search.anima({x:'-100%'}, 400);

    $sideBar.find('.search').click(function (e) {
        var $currentTarget = $(e.currentTarget);
        var value = '12%';
        if ($currentTarget.hasClass('cbp-vicurrent')) {
            $(e.currentTarget).removeClass('cbp-vicurrent');

            $search.addClass('slideLeft');
            value = '-100%';
        } else {
            $(e.currentTarget).addClass('cbp-vicurrent');

            $search.removeClass('slideLeft');
        }

    	setTimeout(function () {
            $search.anima({x: value}, 400);
        }, 0);
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
    $.getJSON('/api/findFacilities', { 
        lat: coords.latitude, 
        lon: coords.longitude, 
        sort: getSortOrder(),
        treatment_group_id: parseInt($treatmentGroups.val(), 10),
    }, searchSuccess).fail(searchError);
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
            address: facility.address,
            city: facility.city,
            state: facility.state,
            zip: facility.zip,
            name: facility.name,
            avgCharges: parseInt(facility.charges, 10)
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

