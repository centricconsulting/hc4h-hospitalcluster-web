var gfx = nokia.maps.gfx,
    GraphicsImage = gfx.GraphicsImage,
	parseCss = gfx.Color.parseCss,
	MarkerTheme = nokia.maps.clustering.MarkerTheme;

var CustomTheme = function (display, infoBubbles) {
	MarkerTheme.call(this, MarkerTheme.POSITION_WEIGHT_CENTER);
	this.init(display, infoBubbles);
};

$.extend(CustomTheme, MarkerTheme);

// CustomTheme constructor function 
CustomTheme.prototype.init = function (display, infoBubbles) {
	var that = this;
	that._infoBubbles = infoBubbles;
	
	display.addListener("mapviewchangestart", that.closeTheBubble);
	
	that._noiseBg = new GraphicsImage(function (gfx, graphicsImage) {
		gfx.beginImage(15, 15, "Cluster");

		gfx.set("fillColor", "#ffffff");
		gfx.set("strokeColor", "#777777");
		gfx.drawRect(0, 0, 15, 15);
		gfx.stroke();
		gfx.fill();
	});
	
	that._clusterBg = new GraphicsImage(function (gfx, graphicsImage) {
		gfx.beginImage(55, 55, "Cluster");

		gfx.set("fillColor", "#ffffff");
		gfx.set("strokeColor", "#777777");
		gfx.drawRect(0, 0, 55, 55);
		gfx.stroke();
		gfx.fill();
	});
};
// CustomTheme helper function to close the info bubble if it is open
CustomTheme.prototype.closeTheBubble = function () {
	var that = this;
	if (that._prevBubbleHandle) {
		that._prevBubbleHandle.close();
	}
}

CustomTheme.prototype.getClusterPresentation = function (data) {
	var that = this,
		clusterSize = data.getSize(),
		points = data.getPoints(),
		markerPos = that.getClusterCoordinate(points),
		clusterColor = MarkerTheme.getColor(clusterSize),
		charLength = (clusterSize + "").length,
		delta = charLength * 2 + 4,
		innerRad = charLength == 1 ? 8 : (charLength * 3 + 5),
		size = innerRad * 2 + delta * 2,
		dataPoint = points[0],
		i = 0,
		infoHtml = that._getBubbleContent(dataPoint),
		marker,
		container = new nokia.maps.map.Container();

	if (!data || clusterSize === 0) {
		throw "Please provide at least one data point";
	}

	marker = new nokia.maps.map.StandardMarker(markerPos, {
		text: ''
	});

	marker.addListener(globalNS.TOUCHORCLICK, function () {
		that.closeTheBubble();

		that._prevBubbleHandle = that._infoBubbles.showBubble(infoHtml, markerPos);
	});

	container.objects.add(new nokia.maps.map.StandardMarker(markerPos, {
		text: ''
	}));
	container.objects.add(marker);

	return container;
};

CustomTheme.prototype._getBubbleContent = function (dataPoint) {
	return '<h5>' + dataPoint.address + '</h5>';
};

CustomTheme.prototype.getNoisePresentation = function (dataPoint) {
	var that = this,
		infoHtml = that._getBubbleContent(dataPoint),
		container = new nokia.maps.map.Container(),
		marker = new nokia.maps.map.StandardMarker(dataPoint, {
			text: ''
		});
	
	container.objects.add(new nokia.maps.map.StandardMarker(dataPoint, {
		text: ''
	}));
	container.objects.add(marker);

	container.addListener(globalNS.TOUCHORCLICK, function () {
		that.closeTheBubble();

		that._prevBubbleHandle = that._infoBubbles.showBubble(infoHtml, dataPoint);
	});

	return container;
};

