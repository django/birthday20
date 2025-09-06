const copy = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>";
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const layer = L.tileLayer(url, { noWrap: true, attribution: copy });

const map = L.map("map", {
	maxBounds: [
		[-90, -180],
		[90, 180],
	],
	layers: [layer],
	minZoom: 2, // Minimum zoom to prevent over-zooming out
}).setView([25, 0], 2.5); // Center the map and initial zoom level

const categoryColors = {
	conference: "#00f8a5", // green
	meetup: "#005935", // accent green
	sprint: "#B57EDC", // lavender
	other: "#222222" // lavender
};

function getColorByCategory(category) {
	return categoryColors[category];
}

let singleEventPopupLayer = null;

function renderEvents(geojsonData, singleEventGeojsonData) {
  if (!geojsonData) {
    return
  }

  	// Marker cluster group
  	var markers = L.markerClusterGroup({
		maxClusterRadius: 15,  // Groups markers together if within 15 pixels of each other, adjustable as needed
		showCoverageOnHover: false,
		zoomToBoundsOnClick: false,
	});
	markers.on('clusterclick', function (a) {
		let currentZoom = map.getZoom();
		const zoomIncrement = 3; // Number of zoom levels to increase on cluster click, adjustable as needed
		let nextZoom = currentZoom + zoomIncrement;
		let maxZoom = map.getMaxZoom();

		if (nextZoom > maxZoom) nextZoom = maxZoom;

		if (nextZoom >= maxZoom - 7) {
			// If zoom level is within 7 levels of max zoom, zoom directly to cluster bounds, adjustable as needed
			a.layer.zoomToBounds({ padding: [20, 20] });
		} else {
			// Just zoom in incrementally if not near max zoom yet
			map.flyTo(a.layer.getBounds().getCenter(), nextZoom, { duration: 0.5, animate: true });
		}
	  });
	markers.on('clustermouseover', function(a) {
		// Get all child markers of the cluster being hovered over
		const clusteredMarkers = a.layer.getAllChildMarkers();

		// Build the popup HTML string from all child features
		let combinedInfo = '';
		clusteredMarkers.forEach(marker => {
		  if (marker.feature && marker.getPopup) {
			const props = marker.feature.properties;
			const popupCircleColor = getColorByCategory(props.event_category);
			// Append a colored circle and marker name to the popup
			combinedInfo += `<b><span style="display:inline-block; width:12px; height:12px; background-color: ${popupCircleColor}; border-radius:50%; margin-right:6px; vertical-align:middle;"></span><span style="color:rgb(3, 98, 136);">${props.name}</span></b><br>`;
		  }
		});

		// Bind a tooltip to the cluster marker with combined info and show it
		a.layer.bindTooltip(combinedInfo || 'No event info available', { sticky: true, direction: 'auto' }).openTooltip();
	  });

	  markers.on('clustermouseout', function(a) {
		a.layer.unbindTooltip();
	  });

	const geojsonLayer = L.geoJSON(geojsonData, {
		pointToLayer: (feature, latlng) => {
			const category = feature.properties.event_category;
			const color = getColorByCategory(category);
			const marker = L.circleMarker(latlng, {
				radius: 8,
				fillColor: color,
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8,
			});

			// Add circle marker to the cluster group
			markers.addLayer(marker);

			return marker;
		},
		onEachFeature: (feature, layer) => {
			const props = feature.properties;
			const eventDate = new Date(props.date + "T00:00:00Z");
		  let eventDateEnd = null;
			if (props.end_date) {
  			eventDateEnd = new Date(props.end_date + "T00:00:00Z");
			}

		  let formattedDate = eventDate.toLocaleDateString("en-US", {
			  weekday: "long",
			  year: "numeric",
			  month: "long",
			  day: "numeric",
			  timeZone: "UTC",
		  });
			if (eventDateEnd) {
			  formattedDate += "-" + eventDateEnd.toLocaleDateString("en-US", {
				  weekday: "long",
				  year: "numeric",
				  month: "long",
				  day: "numeric",
				  timeZone: "UTC",
			  });
		  }

			layer.bindPopup(`
                <a href="${props.website}" target="_blank"><b>${props.name}</b><br></a>
                <strong>${props.event_category_label}</strong><br>
                ${formattedDate}<br>
                <small>${props.address}</small><br>
            `);

			if (singleEventGeojsonData && feature === singleEventGeojsonData) {
				singleEventPopupLayer = layer;
			}
		},
	})

	// Add the cluster group to the map instead of geojsonLayer
	map.addLayer(markers);

	// Auto-fit only if there are features
	if (geojsonData.features.length > 0 && !singleEventGeojsonData) {
		map.fitBounds(geojsonLayer.getBounds(), {
			//padding: [20, 20],
			//maxZoom: 14,
		});
	}

	if (singleEventGeojsonData) {
		map.fitBounds(L.geoJSON({ type: "FeatureCollection", features: [singleEventGeojsonData] }).getBounds().pad(0.2));
		singleEventPopupLayer.openPopup();
	}
}

let eventDetailData = null;
if (singleEventData) {
    eventDetailData = eventsData.features.find(f =>
		(f.properties.name && singleEventData.title && f.properties.name === singleEventData.title) &&
		(f.properties.date && singleEventData.event_date && f.properties.date === singleEventData.event_date)
	);
}
// Render events directly from Hugo data
renderEvents(eventsData, eventDetailData);

// Reset view control
L.Control.ResetView = L.Control.extend({
	onAdd: function () {
		const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
		const button = L.DomUtil.create("a", "leaflet-control-resetview", container);
		button.href = "#";
		button.title = "Reset View";
		button.innerHTML = "↻";
		L.DomEvent.on(button, "click", this._resetView, this);
		return container;
	},

	_resetView: function (e) {
		L.DomEvent.stopPropagation(e);
		L.DomEvent.preventDefault(e);

		// If you have a single event layer with bounds
        if (eventDetailData && eventDetailData.geometry) {
            this._map.fitBounds(L.geoJSON({ type: "FeatureCollection", features: [eventDetailData] }).getBounds().pad(0.2));
			singleEventPopupLayer.openPopup();
        }
		else {
        	// Else, fallback to default view, the world view
			this._map.setView([30, 0], 2);
		}
	},
});

L.control.resetView = (opts) => new L.Control.ResetView(opts);

L.control.resetView({ position: "topleft" }).addTo(map);

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'info legend');
	var categories = Object.keys(categoryColors);

	categories.forEach(function(category) {
		div.innerHTML +=
		  '<i style="background:' + categoryColors[category] + '; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i>' +
		  category.charAt(0).toUpperCase() + category.slice(1) + '<br>';
	  });

	  return div;
};

legend.addTo(map);
