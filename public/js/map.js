mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: mapcoordinates,
    zoom: 9
});
const marker1 = new mapboxgl.Marker({color:"red"})
.setLngLat(mapcoordinates)
.addTo(map);
	