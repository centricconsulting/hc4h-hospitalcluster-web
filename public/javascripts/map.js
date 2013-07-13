/* This commented out code is for Nokia Mobile HTML5 map
//Play has some problems with mapping subfolders from the assets folder
nokia.mh5.assetsPath = "http://api.maps.nokia.com/mobile/1.0.2/lib/";

//configure the map here: http://developer.here.com/mobile_html5_appbuilder
nokia.mh5.app.embed({ 
    "domNode": "body", 
    "appId": "nwnAXT8rzAkbVKD9pXUU", 
    "appCode": "XNxljzyENzuU67zixuhmEA", 
    "configuration": { 
        "distanceUnit": "mi", 
        "map": { 
            "infobubble": { 
                "content": [ "title" ] 
            } 
        }, 
        "search": null, 
        "details": { 
            "images": false, 
            "ownerContent": false, 
            "reviews": false, 
            "guides": false, 
            "actions": { 
                "share": false 
            } 
        } 
    } 
});

//turn off POIs
nokia.mh5.app.controller.current.page.map._cartoPOI.deactivate();

["activate", "change", "deactivate", "error", "lost"].forEach(function (type) {
    nokia.mh5.event.add(nokia.mh5.geolocation, "position" + type, function (p) {
        doSearch(p.data.coords);
    });
});
*/

nokia.Settings.set("appId", "nwnAXT8rzAkbVKD9pXUU"); 
nokia.Settings.set("authenticationToken", "XNxljzyENzuU67zixuhmEA");

var mapContainer = document.getElementById("mapContainer");

var map = new nokia.maps.map.Display(mapContainer, {
        // Zoom level for the map
        'zoomLevel': 9,
        components: [ 
            // Behavior collection
            new nokia.maps.map.component.Behavior(),
            new nokia.maps.map.component.ZoomBar(),
            new nokia.maps.map.component.Overview(),
            new nokia.maps.map.component.TypeSelector(),
            new nokia.maps.map.component.ScaleBar() 
        ],
        // Map center coordinates
        'center': [39.789017,-86.152146] 
    }
);

globalNS.map = map;

if (nokia.maps.positioning.Manager) {
    var positioning = new nokia.maps.positioning.Manager();
    
    // Gets the current position, if available the first given callback function is executed else the second
    positioning.getCurrentPosition(getPositionSuccess, getPositionError);
}

function getPositionSuccess (position) {
    var coords = position.coords, // we retrieve the longitude/latitude from position
        marker = new nokia.maps.map.StandardMarker(coords), // creates a marker
        /* Create a circle map object  on the  geographical coordinates of
         * provided position with a radius in meters of the accuracy of the position
         */
        accuracyCircle = new nokia.maps.map.Circle(coords, coords.accuracy),
        map = globalNS.map;
    
    // Add the circle and marker to the map's object collection so they will be rendered onto the map.
    map.objects.addAll([accuracyCircle, marker]);
    /* This method zooms the map to ensure that the bounding box calculated from the size of the circle
     * shape is visible in its entirety in map's viewport. 
     */
    map.setCenter(coords, "default");

    //store the center coords object
    globalNS.center = { latitude: coords.latitude, longitude: coords.longitude };

    setTimeout(doSearch, 0, coords);
}

function getPositionError (error) {
    var errorMsg = "Location could not be determined: ";
            
    // We determine what caused the error and generate error message
    if (error.code === 1) {
        errorMsg += "PERMISSION_DENIED";
    }
    else if (error.code === 2) {
        errorMsg += "POSITION_UNAVAILABLE";
    }
    else if (error.code === 3) {
        errorMsg += "TIMEOUT";
    }
    else {
        errorMsg += "UNKNOWN_ERROR";
        
        // Throw an alert with error message
        alert(errorMsg);
    }
}

function onMapViewChange (event) {
    var center = event.display.center;

    //ignore event triggers for the same the center.
    if (globalNS.hasOwnProperty('center') && globalNS.center.latitude === center.latitude && globalNS.center.longitude === center.longitude) {
        return false;
    }

    if (event.MAPVIEWCHANGE_CENTER) {
        //update the center coords object
        globalNS.center = { latitude: center.latitude, longitude: center.longitude };

        doSearch(center);
    }
}

// Create the Clustering Provider
var ClusterProvider = nokia.maps.clustering.ClusterProvider,
    clusterProvider = new ClusterProvider(globalNS.map, {
        eps: 16,
        minPts: 1,
        dataPoints: []
    });

    globalNS.clusterProvider = clusterProvider;

    clusterProvider.addObserver('state', onClusteringStateChanged);

function onClusteringStateChanged (obj, key, state, oldValue) {
    if (state === ClusterProvider.STATE_CLUSTERED && !globalNS.mapViewChangeSubscribed) {
        globalNS.mapViewChangeSubscribed = true;
        globalNS.map.addListener('mapviewchangeend', onMapViewChange);
    }
}

