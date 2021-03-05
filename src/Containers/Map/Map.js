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
    ],
    markers: [],
  };

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
    // let map = new window.google.maps.Map(this.googleMapRef.current, {
    //   zoom: 16,
    //   // center: {
    //   //   lat: coordinates.lat(),
    //   //   lng: coordinates.lng(),
    //   // },
    //   disableDefaultUI: true,
    // });

    // let bounds = this.createMarkers(map);
    // map.fitBounds(bounds);
    // // return map;

    let map;
    let panorama;
    // 20.96778, -89.62426
    const berkeley = { lat: 20.96778, lng: -89.62426 };
    const sv = new window.google.maps.StreetViewService();
    panorama = new window.google.maps.StreetViewPanorama(
      document.getElementById("pano")
    );
    // Set up the map.
    map = new window.google.maps.Map(this.googleMapRef.current, {
      center: berkeley,
      zoom: 16,
      streetViewControl: false,
    });

    const processSVData =(data, status) => {
      if (status === "OK") {
        const location = data.location;
        const marker = new window.google.maps.Marker({
          position: location.latLng,
          map,
          title: location.description,
        });
        panorama.setPano(location.pano);
        panorama.setPov({
          heading: 270,
          pitch: 0,
        });
        panorama.setVisible(true);
        marker.addListener("click", () => {
          const markerPanoID = location.pano;
          // Set the Pano to use the passed panoID.
          panorama.setPano(markerPanoID);
          panorama.setPov({
            heading: 270,
            pitch: 0,
          });
          panorama.setVisible(true);
        });
      } else {
        console.error("Street View data not found for this location.");
      }
    }

    // Set the initial Street View camera to the center of the map
    sv.getPanorama({ location: berkeley, radius: 50 }, processSVData);
    // Look for a nearby Street View panorama when the map is clicked.
    // getPanorama will return the nearest pano when the given
    // radius is 50 meters or less.
    map.addListener("click", (event) => {
      sv.getPanorama({ location: event.latLng, radius: 50 }, processSVData);
    });


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

      this.state.markers.push(marker);

      // extend the bounaries of the map for each marker
      bounds.extend(marker.position);

      // Adde listener to open info window
      marker.addListener('click', () =>
        this.populateInfoWindow(map, marker, infoWindow)
      );
    }
    return bounds;
  };

  // // Populates infoWindow when the marker is clicked.
  // // only one infoWindow will be opened based on the marker position
  // populateInfoWindow = (map, marker, infoWindow) => {
  //   // make sure the infowindow is  not already open on this marker
  //   if (infoWindow.marker !== marker) {
  //     infoWindow.marker = marker;
  //     infoWindow.setContent('<div>' + marker.title + '</div>');
  //     infoWindow.open(map, marker);

  //     // make sure marker property is cleared if the infowindow is closed
  //     infoWindow.addListener('closeclick', () => {
  //       infoWindow.marker = null;
  //     });
  //   }
  // };

    // Populates infoWindow when the marker is clicked.
  // only one infoWindow will be opened based on the marker position
  populateInfoWindow = (map, marker, infoWindow) => {
    // make sure the infowindow is  not already open on this marker
    if (infoWindow.marker !== marker) {
      // Clear infoWindow contnet to give the streetview time to load
      infoWindow.setContent('');
      infoWindow.marker = marker;

      // make sure marker property is cleared if the infowindow is closed
      infoWindow.addListener('closeclick', () => {
        infoWindow.marker = null;
      });

      // Create a panorama view
      let streetViewService = new window.google.maps.StreetViewService();
      let radius = 50;

	  // StreetViewService callback function
      const getStreetView = (data, status) => {
        if (status === window.google.maps.StreetViewStatus.OK) {
          let nearStreetViewLocation = data.location.latLng;
          let heading = window.google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation,
            marker.position
          );

          infoWindow.setContent(
            '<div>' + marker.title + '</div><div id="pano" style="width:400px; height:400px;"></div>'
          );

          let panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById("pano")
          );

          panorama.setPano(nearStreetViewLocation);

          panorama.setPov({
            heading: heading,
            pitch: 30,
          })

          panorama.setVisible(true);

        } else {
          infoWindow.setContent(
            '<div>' + marker.title + '</div><div>No StreetViewFound</div>'
          );
        }
      };

      // Use streetviewservice to get closest streetview image withing
      // 50 meters of the markers position
      streetViewService.getPanorama({location:marker.position,radius:radius},getStreetView);
      
      infoWindow.open(map, marker);
    }
  };



  render() {
    if (this.props.drawingToolsClicked) {
      console.log('it was clicked');
    }else{
      console.log('it was clicked again');
    }
    return (
      <>
      <div
        className={classes.Map}
        id={classes.GoogleMap}
        ref={this.googleMapRef}
        // style={{ width: '400px', height: '300px' }}
      />
      <div id="pano" className={classes.Pano}></div>

      {/* // <div className={classes.Map}>
      //   <img alt="laphoto" src={mapphoto}/>
      // </div> */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    drawingToolsClicked: state.drawingToolsClicked,
  };
};

export default connect(mapStateToProps)(MapContainer);
