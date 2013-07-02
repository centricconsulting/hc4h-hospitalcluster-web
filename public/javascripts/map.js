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

setTimeout(function () {
    $('#search-panel-div').addClass('slideup');
});

$('#search-panel-div').click($.proxy(function (e) {
    $(e.currentTarget).addClass('slideup');
}, this));