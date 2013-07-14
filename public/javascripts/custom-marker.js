var GraphicsImage = nokia.maps.gfx.GraphicsImage,
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

CustomTheme.prototype.getClusterPresentation = function (dataPoints) {
	if (dataPoints.getSize() > 0 && dataPoints.getSize() <= 5) {
        return new nokia.maps.map.StandardMarker (dataPoints.getBounds().getCenter(), {  
                text:  dataPoints.getSize(),  
                brush: {
                    color: '#6DE8C5'
                }
            }
        );
    }
	if (dataPoints.getSize() > 5 && dataPoints.getSize() <= 10) {
        return new nokia.maps.map.StandardMarker (dataPoints.getBounds().getCenter(), {  
                text:  dataPoints.getSize(),  
                brush: {
                    color: '#F2C744'
                }
            }
        );
    }
	else if (dataPoints.getSize() > 10) {
        return new nokia.maps.map.StandardMarker (dataPoints.getBounds().getCenter(), {  
                text:  dataPoints.getSize(),  
                brush: {
                    color: '#F28D44'
                }
            }
        );
    }
};

CustomTheme.prototype._getBubbleContent = function (dataPoint) {
	var html = '<h5>' + dataPoint.name + '</h5><br/><address>' +
	  dataPoint.address + '<br>' + 
	  dataPoint.city + ', ' + dataPoint.state + ' ' + dataPoint.zip + '<br><br>' +
	  '<span class="label label-info">Avg. Total Charges: $' + dataPoint.avgCharges + '</span>' +
	'</address>';

	return html;
};

CustomTheme.prototype.getNoisePresentation = function (dataPoint) {
	var that = this,
		infoHtml = that._getBubbleContent(dataPoint),
		container = new nokia.maps.map.Container(),
		marker = new nokia.maps.map.StandardMarker(dataPoint, {
			text: ''
		});
	
	container.objects.add(marker);

	container.addListener(globalNS.TOUCHORCLICK, function () {
		that.closeTheBubble();

		that._prevBubbleHandle = that._infoBubbles.showBubble(infoHtml, dataPoint);
	});

	return container;
};

