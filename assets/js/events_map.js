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
	const geojsonLayer = L.geoJSON(geojsonData, {
		pointToLayer: (feature, latlng) => {
			const category = feature.properties.event_category;
			const color = getColorByCategory(category);

			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: color,
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8,
			});
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
	}).addTo(map);

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
