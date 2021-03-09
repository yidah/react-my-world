import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Map.module.css';
// import mapphoto from '../../assets/images/mapmockup.png';

class MapContainer extends Component {
  constructor() {
    super();
    this.googleMapRef = React.createRef();
  }

  state = {
    locations: [
      {
        title: 'Paseo Montejo',
        location: { lat: 20.97823899166957, lng: -89.6194619683157 },
      },
      {
        title: 'Cenote Xlacah',
        location: { lat: 21.091099698327348, lng: -89.59812711762955 },
      },
      {
        title: 'Plaza Grande',
        location: { lat: 20.967153502072854, lng: -89.62369432104116 },
      },
      {
        title: 'Zona Arqueologica Dzibilchaltún',
        location: { lat: 21.092487149469196, lng: -89.59526857956277 },
      },
      {
        title: 'El Pinar',
        location: { lat: 20.991031337796024, lng: -89.61941536479338 },
      },
    ]
    
  };

  polygon = null;
  drawingManager = null;
  map = null;
  markers= [];

  componentDidMount = () => {
    // check the googlescript exists
    if (!document.getElementById('googleScript')) {
      const googleMapScript = document.createElement('script');
      googleMapScript.setAttribute('id', 'googleScript');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry,places&v=weekly&key=${process.env.REACT_APP_API_KEY}`;
      googleMapScript.async = true;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener('load', () => {
        // this.getLatLng();
        this.drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
          },
        });

        this.drawingManager.addListener('overlaycomplete', (event) =>
          this.drawPolygon(event)
        );
        const coordinates = new window.google.maps.LatLng(20.96778, -89.62426);
        this.createGoogleMap(coordinates);
      });
    }
  };

  // getLatLng = () => {
  //   let lat, lng;

  //   let placeName = 'Paseo Montejo';
  //   new window.google.maps.Geocoder().geocode(
  //     { address: `${placeName}` },
  //     (results, status) => {
  //       if (status === window.google.maps.GeocoderStatus.OK) {
  //       //   placeId = results[0].place_id;
  //         let map = this.createGoogleMap(results[0].geometry.location);
  //         map.setCenter({
  //           lat: results[0].geometry.location.lat(),
  //           lng: results[0].geometry.location.lng(),
  //         })

  //         // MARKER
  //         lat = results[0].geometry.location.lat();
  //         lng = results[0].geometry.location.lng();
  //         let marker = new window.google.maps.Marker({
  //             position: { lat, lng },
  //             map: map,
  //             animation: window.google.maps.Animation.DROP,
  //             title: `${placeName}`
  //         });

  //         // INFO WINDOW
  //         var infoWindow= new window.google.maps.InfoWindow({
  //             content: 'Paseo montejo un sin fin the historias'
  //         });

  //         marker.addListener('click', function(){
  //             infoWindow.open(map, marker);
  //         });

  //       } else {
  //         alert(
  //           'Geocode was not successful for the following reason: ' + status
  //         );
  //       }
  //     }
  //   );
  // };

  createGoogleMap = (coordinates) => {
    this.map = new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 16,
      // center: {
      //   lat: coordinates.lat(),
      //   lng: coordinates.lng(),
      // },
      disableDefaultUI: true,
    });
    let bounds = this.createMarkers(this.map);
    this.map.fitBounds(bounds);
  };

  createMarkers = (map) => {
    let infoWindow = new window.google.maps.InfoWindow();
    let bounds = new window.google.maps.LatLngBounds();
    // We create array of markers
    for (let i = 0; i < this.state.locations.length; i++) {
      // Position from the location array
      let position = this.state.locations[i].location;
      let title = this.state.locations[i].title;
      // Marker per location
      let marker = new window.google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        id: i,
      });

      this.markers.push(marker);

      // extend the bounaries of the map for each marker
      bounds.extend(marker.position);

      // Adde listener to open info window
      marker.addListener('click', () =>
        this.populateInfoWindow(map, marker, infoWindow)
      );
    }
    return bounds;
  };

  // Populates infoWindow when the marker is clicked.
  // only one infoWindow will be opened based on the marker position
  populateInfoWindow = (map, marker, infoWindow) => {
    let panorama;
    const sv = new window.google.maps.StreetViewService();

    // make sure the infowindow is  not already open on this marker
    if (infoWindow.marker !== marker) {
      // Clear infoWindow contnet to give the streetview time to load
      infoWindow.setContent('');
      infoWindow.marker = marker;

      // make sure marker property is cleared if the infowindow is closed
      infoWindow.addListener('closeclick', () => {
        infoWindow.marker = null;
      });

      // StreetViewService callback function
      const processSVData = (data, status) => {
        if (status === 'OK') {
          const location = data.location;
          infoWindow.setContent(
            '<div>' +
              marker.title +
              '</div><div id="pano" style="width:400px; height:400px;"></div>'
          );
          panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById('pano')
          );
          marker.setPosition(location.latLng);
          panorama.setPano(location.pano);
          panorama.setPov({
            heading: 270,
            pitch: 0,
          });
          panorama.setVisible(true);
        } else {
          console.error('Street View data not found for this location.');
        }
      };

      // Use streetviewservice to get closest streetview image withing
      // 50 meters of the markers position
      sv.getPanorama({ location: marker.position, radius: 50 }, processSVData);
      infoWindow.open(map, marker);
    }
  };

  drawPolygon = (event) => {
    //Is there exsiting poligon remove it and its markers too
    if (this.polygon) {
      this.polygon.setMap(null);
      //here remove markers
    }

    // switch drawing to HAND (no longer drawing)so user can click on the markers
    // this.drawingManager.setDrawingMode(null);

    // create a new editable polygon
    this.polygon = event.overlay;
    this.polygon.setEditable(true);

    //here search markers withing polygon
    this.searchWithinPolygon();
    
    // Search if poly changed
    this.polygon
      .getPath()
      .addListener('set_at', this.searchWithinPolygon);
    this.polygon
      .getPath()
      .addListener('insert_at', this.searchWithinPolygon);

  };

  searchWithinPolygon = () => {
    for (let i = 0; i < this.markers.length; i++) {
      if(window.google.maps.geometry.poly.containsLocation(this.markers[i].position, this.polygon)){
        this.markers[i].setMap(this.map);
      }else{
        this.markers[i].setMap(null);
      }      
    }
  };

  render() {
    // Toogle drawing tools
    if (this.props.showDrawingTools && this.drawingManager.map) {
      this.drawingManager.setMap(null);
      // remove polygon if user removed map
      if(this.polygon){
        this.polygon.setMap(null);
      }
    } else if (!this.props.showDrawingTools && this.drawingManager) {
      this.drawingManager.setMap(this.map);
    }
    return (
      <>
        <div className={classes.Map} id="GoogleMap" ref={this.googleMapRef} />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showDrawingTools: state.map.showDrawingTools,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
