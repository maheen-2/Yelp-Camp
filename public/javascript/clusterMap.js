// Requiring MapBox token:
mapboxgl.accessToken = mapToken;
// Creating a map:
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // stylesheet location URL
center: [-103.5917, 40.6699], // starting position [lng, lat]
zoom: 3 // starting zoom
});
 
// Adding map control options for the convenience of the user.
map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

// 1️⃣
map.on('load', () => {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map.addSource('campgrounds', {
type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
//Initially, data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson' ◀ go to this link to know its JSON data & to know why we used features key.
// But since we want our campgrounds to be shown on this cluster map we points data to campgrounds.
// Also, add a line of code in "index.ejs" to stringify campgrounds.

data: campgrounds,
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
// 2️⃣
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'campgrounds',
filter: ['has', 'point_count'],
paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * PINK, 20px circles when point count is less than 10
//   * PURPLE, 30px circles when point count is between 10 and 30
//   * BLUE, 40px circles when point count is greater than or equal to 30
'circle-color': [
    'step',
    ['get', 'point_count'],
    '#f1c0e8', // color
    10, // corresponding to its point (camp) count
    '#cfbaf0',
    30,
    '#a3c4f3'
],
'circle-radius': [
'step',
['get', 'point_count'],
15, // radius of each cluster (circle)
10, // corresponding to its point (camp) count 👉🏼 radius 15px if point count is >= 10
20,
30, // radius 20px if point count is 10 - 30
25 // radius 25px if point count is < 30
]
}
});

// 3️⃣
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'campgrounds',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
// 4️⃣
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'campgrounds',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#11b4da',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
// 5️⃣
// inspect a cluster on click
map.on('click', 'clusters', (e) => {
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('campgrounds').getClusterExpansionZoom(
clusterId,
(err, zoom) => {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
// 6️⃣
// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', (e) => {
    const { popUpMarkup } = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
 
new mapboxgl.Popup()
.setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
});
 
// 7️⃣
// When mouse enters clusters, cursor changes to pointer 🤚🏼.
map.on('mouseenter', 'clusters', () => {
map.getCanvas().style.cursor = 'pointer';
});

// 8️⃣
// When mouse leaves clustors, back to cursor arrow 👆🏼.
map.on('mouseleave', 'clusters', () => {
map.getCanvas().style.cursor = '';
});
});