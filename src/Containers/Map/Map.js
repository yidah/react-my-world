import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './Map.module.css';
import * as mapActions from '../../store/actions/map';

class MapContainer extends Component {
  constructor() {
    super();
    this.googleMapRef = React.createRef();
  }

  polygon = null;
  drawingManager = null;
  map = null;
  placeMarkers=[];
  nearByPlacesAutocomplete= null;

  componentDidMount = () => {

    if(!document.getElementById('googleScript')){
      // this.props.history.push('/');
    }else{
      
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
  

      // SEARCH BOX IMPLEMENTATION - DOES NOT RESTRICT TO AREA SELECTED
      // this.nearByPlacesSearchBox = new window.google.maps.places.SearchBox(document.getElementById('nearByPlacesSearchBox'));
      // this.withinTimePlaceSearchBox = new window.google.maps.places.SearchBox(document.getElementById('withinTimePlace'));
      
      // SEARCH BOX EVENT LISTENER
      // 1. the user selects a prediction from the picklist
      // 2. NOTE: THERE SI ANOTHER EVENT HANDLER IN FILTERS COMPOENNT ATTACHED TO
      //    THE GO BUTTON WHEN THE USER SELECTS A PREDICTIONS AND CLICKS "GO"
      // this.nearByPlacesSearchBox.addListener('places_changed', ()=> this.searchBoxPlaces(this));

      let options = {
        strictBounds: true
      };
      this.nearByPlacesSearchBox = new window.google.maps.places.Autocomplete(document.getElementById('nearByPlacesSearchBox'),options);
      this.withinTimePlaceSearchBox = new window.google.maps.places.Autocomplete(document.getElementById('withinTimePlace'),options);
      
  
      const query = new URLSearchParams(this.props.location.search);
      let lat = query.get('placeLat');
      let lng = query.get('placeLng');
      let name = query.get('placeName');
      let id = query.get('placeId');
      let icon = query.get('placeIcon');
  
      if(lat && lng){
        const location = new window.google.maps.LatLng(lat, lng);
        this.createGoogleMap(location, name, id, icon);

      }else{
        this.getLatLng(name);
      }

    }

  };

  // When drawing a polygon we only hide as the
  // user can extend the boundaries and markers within
  // the boundaries should appear
  hideMarkers = (markers) => {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  //User search for different nearby places
  deleteMarkers = (markers) => {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
      markers[i] = null
    }
  };

  createMarkersForPlaces =(places)=>{
    // Clean up other searches
    this.deleteMarkers(this.placeMarkers);
    this.placeMarkers.length = 0;

    let infoWindow = new window.google.maps.InfoWindow();
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
        animation: window.google.maps.Animation.DROP,
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

      // Adde listener to open info window
      marker.addListener('click', () =>
            this.populateInfoWindow(this.map, marker, infoWindow)
          );

      this.map.fitBounds(bounds);

      this.props.setNearbyPlaceGoSearch(false);
    }
  }

  // searchBoxPlaces = (search)=>{
  //   this.hideMarkers(this.placeMarkers);
  //   let places = this.nearByPlacesSearchBox.getPlaces();
  //   if(places.length === 0){
  //     alert('we did not find any places matcching that search');
  //   }else{
  //     this.createMarkersForPlaces(places);
  //   }
  // }

    getLatLng = (exploredPlace) => {

    new window.google.maps.Geocoder().geocode(
      { address: `${exploredPlace}` },
      (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
        let icon = 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png';
        let address = results[0].formatted_address;
        let placeName =address.substring(0,address.indexOf(","));

        this.createGoogleMap(results[0].geometry.location,placeName, results[0].place_id, icon);
        } else {
          alert(
            'Geocode was not successful for the following reason: ' + status
          );
        }
      }
    );
  };

  searchBoxGoPlaces=()=>{
    document.getElementById('filtersDiv').style.display = "none";
    
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
  createGoogleMap = (location, placeName, placeId, placeIcon) => {
    this.props.setExploredPlaceName(placeName);

    let bounds = new window.google.maps.LatLngBounds();
    let infoWindow = new window.google.maps.InfoWindow();
    this.map = new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 13,
      center: {
        lat: location.lat(),
        lng: location.lng(),
      },
      disableDefaultUI: true,
    });

    let icon ={
      url:placeIcon,
      size: new window.google.maps.Size(35,35),
      origin: new window.google.maps.Point(0,0),
      anchor: new window.google.maps.Point(15,34),
      scaledSize: new window.google.maps.Size(25,25),
    };

    let marker = new window.google.maps.Marker({
      map:this.map,
      icon:icon,
      title:placeName,
      animation: window.google.maps.Animation.DROP,
      position: location,
      id:placeId,
    });

    // Adde listener to open info window
    marker.addListener('click', () =>
        this.populateInfoWindow(this.map, marker, infoWindow)
      );

    bounds.extend(location);

    // SEARCH BOX IMPLEMENTATION - REMOVED AS IT DOES NOT RESTRICT SEARCH AREA
    // this.nearByPlacesSearchBox.setBounds(bounds);
    // this.withinTimePlaceSearchBox.setBounds(bounds);

    this.nearByPlacesSearchBox.bindTo('bounds', this.map);
    this.withinTimePlaceSearchBox.bindTo('bounds', this.map);
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
    for (let i = 0; i < this.placeMarkers.length; i++) {
      if (
        window.google.maps.geometry.poly.containsLocation(
          this.placeMarkers[i].position,
          this.polygon
        )
      ) {
        this.placeMarkers[i].setMap(this.map);
      } else {
        this.placeMarkers[i].setMap(null);
      }
    }
  };

  getDistancesBetweenMarkersAndAddress = (response, status) => {
    if (status === 'OK') {
      let maxDuration = this.props.maxDuration;
      let origins = response.originAddresses;
      let destinations = response.destinationAddresses;

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
           this.placeMarkers[i].setMap(this.map);

           //InfoWindow that opens immediately with distance and duration 
           let infowindow = new window.google.maps.InfoWindow({
             content:'<div><b>From:</b> ' + from +'</div><div><b>To:</b> ' + to +'</div><div><b>Time and Distance: </b>' + durationText + ' away, ' + distanceText +'</div>'
           });
           
           infowindow.open(this.props.map,this.placeMarkers[i]);
           this.placeMarkers[i].infowindow= infowindow;

           //close the small window if user clicks marker 
           window.google.maps.event.addListener(this.placeMarkers[i], 'click', ()=>{
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
    this.hideMarkers(this.placeMarkers);

    //initialized distance matrix service
    let distanceMatrixService = new window.google.maps.DistanceMatrixService();
    let address = document.getElementById('withinTimePlace').value;

    if (address === '') {
      alert('You must enter an address, estimate time and transport to get there');
    } else {
      let origins = [];
      for (let i = 0; i < this.placeMarkers.length; i++) {
        origins[i] = this.placeMarkers[i].position;
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
    setExploredPlaceName: (payload) => dispatch(mapActions.setExploredPlaceName(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
