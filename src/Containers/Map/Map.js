import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Map.module.css';
import * as mapActions from '../../store/actions/map';
// import {hideMarkers} from '../../utils/utils';

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
    ],
  };

  polygon = null;
  drawingManager = null;
  map = null;
  markers = [];
  placeMarkers=[];
  nearByPlacesAutocomplete= null;


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

        // this.nearByPlacesAutocomplete = new window.google.maps.places.Autocomplete(document.getElementById('nearByPlacesSearch'));
        this.nearByPlacesSearchBox = new window.google.maps.places.SearchBox(document.getElementById('nearByPlacesSearchBox'));
        this.withinTimePlaceSearchBox = new window.google.maps.places.SearchBox(document.getElementById('withinTimePlace'));

        // 1. the user selects a prediction from the picklist
        // 2. NOTE: THERE SI ANOTHER EVENT HANDLER IN FILTERS COMPOENNT ATTACHED TO
        //    THE GO BUTTON WHEN THE USER SELECTS A PREDICTIONS AND CLICKS "GO"
        this.nearByPlacesSearchBox.addListener('places_changed', ()=> this.searchBoxPlaces(this));


        const coordinates = new window.google.maps.LatLng(20.96778, -89.62426);
        this.createGoogleMap(coordinates);
      });
    }
  };

  hideMarkers = (markers) => {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  createMarkersForPlaces =(places)=>{
    let bounds = new window.google.maps.LatLngBounds();
    for (let i = 0; i < places.length; i++) {
      let place = places[i];
      let icon ={
        url:place.icon,
        size: new window.google.maps.Size(35,35),
        origin: new window.google.maps.Point(0,0),
        anchor: new window.google.maps.Point(15,34),
        scaledSize: new window.google.maps.Size(25,25),
      };

      let marker = new window.google.maps.Marker({
        map:this.map,
        icon:icon,
        title:place.name,
        position: place.geometry.location,
        id:place.id,
      });

      this.placeMarkers.push(marker);

      if(place.geometry.viewport){
        //Only geocodes have viewport
        bounds.union(place.geometry.viewport);
      }else{
        bounds.extend(place.geometry.location);
      }

      this.map.fitBounds(bounds);

      this.props.setNearbyPlaceGoSearch(false);
    }
  }

  searchBoxPlaces = (search)=>{
    this.hideMarkers(this.placeMarkers);
    let places = this.nearByPlacesSearchBox.getPlaces();
    if(places.length === 0){
      alert('we did not find any places matcching that search');
    }else{
      this.createMarkersForPlaces(places);
    }
  }

  searchBoxGoPlaces=()=>{
    let bounds =this.map.getBounds();
    this.hideMarkers(this.placeMarkers);
    let placesService = new window.google.maps.places.PlacesService(this.map);
    placesService.textSearch({
      query:document.getElementById('nearByPlacesSearchBox').value,
      bounds:bounds
    },(results, status)=>{
      if(status === window.google.maps.places.PlacesServiceStatus.OK){
        this.createMarkersForPlaces(results);
      }
    });

  }



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

    this.nearByPlacesSearchBox.setBounds(bounds);
    this.withinTimePlaceSearchBox.setBounds(bounds);
    // this.nearByPlacesAutocomplete.bindTo('bounds', this.map);

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
    this.polygon.getPath().addListener('set_at', this.searchWithinPolygon);
    this.polygon.getPath().addListener('insert_at', this.searchWithinPolygon);
  };

  searchWithinPolygon = () => {
    for (let i = 0; i < this.markers.length; i++) {
      if (
        window.google.maps.geometry.poly.containsLocation(
          this.markers[i].position,
          this.polygon
        )
      ) {
        this.markers[i].setMap(this.map);
      } else {
        this.markers[i].setMap(null);
      }
    }
  };

  getDistancesBetweenMarkersAndAddress = (response, status) => {
    if (status === 'OK') {
      let maxDuration = this.props.maxDuration;
      let origins = response.originAddresses;
      let destinations = response.destinationAddresses;

      // let atLeastOne = false;
      for (let i = 0; i < origins.length; i++) {
        let results = response.rows[i].elements;
        for (let j = 0; j < results.length; j++) {
          let element = results[j];
          let distanceText = element.distance.text;
          let durationText = element.duration.text;
          let duration = element.duration.value/60;
          let from = origins[i];
          let to = destinations[j];
          
          //Display markers that are within time selected
          if(duration <= maxDuration){
           this.markers[i].setMap(this.map);
          //  atLeastOne = true;

           //InfoWindow that opens immediately with distance and duration 
           let infowindow = new window.google.maps.InfoWindow({
             content:'<div><b>From:</b> ' + from +'</div><div><b>To:</b> ' + to +'</div><div><b>Time and Distance: </b>' + durationText + ' away, ' + distanceText +'</div>'
           });
           
           infowindow.open(this.props.map,this.markers[i]);
           this.markers[i].infowindow= infowindow;

           //close the small window if user clicks marker 
           window.google.maps.event.addListener(this.markers[i], 'click', ()=>{
           infowindow.close();
           })
          }
        }
      }
    } else {
      alert('Error while getting distances. The error was: ', status);
    }

    this.props.setSearchWithinTime(false);
  };

  SearchWithingTime = () => {

    // this.hideMarkers();
    this.hideMarkers(this.markers);

    //initialized distance matrix service
    let distanceMatrixService = new window.google.maps.DistanceMatrixService();
    let address = document.getElementById('withinTimePlace').value;

    if (address === '') {
      alert('You must enter an address, estimate time and transport to get there');
    } else {
      let origins = [];
      for (let i = 0; i < this.markers.length; i++) {
        origins[i] = this.markers[i].position;
      }
      let destination = address;
      let mode = this.props.mode;

      //get distances between origins (markers) and the destination (address)
      distanceMatrixService.getDistanceMatrix(
        {
          origins: origins,
          destinations: [destination],
          travelMode: window.google.maps.TravelMode[mode],
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        this.getDistancesBetweenMarkersAndAddress
      );
    }
  };



  render() {
    // Toogle drawing tools
    if (!this.props.showDrawingTools && this.drawingManager) {
      this.drawingManager.setMap(null);
      // remove polygon if user removed map
      if (this.polygon) {
        this.polygon.setMap(null);
      }
    } else if (this.props.showDrawingTools && !this.drawingManager.map) {
      this.drawingManager.setMap(this.map);
    }

    if(this.props.searchWithinTime){
      this.SearchWithingTime();
    }

    if(this.props.searchNearbyPlaces){
      this.searchBoxGoPlaces();
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
    searchNearbyPlaces: state.map.searchNearbyPlaces,
    showDrawingTools: state.map.showDrawingTools,
    searchWithinTime: state.map.searchWithinTime,
    mode:state.filters.mode,
    maxDuration: state.filters.maxDuration
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSearchWithinTime: (payload) => dispatch(mapActions.setSearchWithinTime(payload)),
    setNearbyPlaceGoSearch: (payload) => dispatch(mapActions.setNearbyPlaceGoSearch(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
