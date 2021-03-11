export const showMarkers = (markers, map) => {
  let bounds = new window.google.maps.LatLngBounds();
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    // Extend the boundaries of the map for each marker
    bounds.extend(markers[i].position);
  }
  // display markes in map
  map.fitBounds(bounds);
};

export const hideMarkers = (markers) => {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
};
