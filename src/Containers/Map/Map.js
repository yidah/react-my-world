import React, { Component } from 'react';
import classes from './Map.module.css';
import mapphoto from '../../assets/images/mapmockup.png';

class MapContainer extends Component {
  constructor() {
    super();
    this.googleMapRef = React.createRef();
  }

  // componentDidMount = () => {
  //   //   console.log ('Description', this.googleMapRef.current);
  //   const googleMapScript = document.createElement('script');
  //   googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
  //   googleMapScript.async = true;
  //   window.document.body.appendChild(googleMapScript);
  //   googleMapScript.addEventListener('load', () => {
  //   this.getLatLng();
  //   //   const coordinates = new window.google.maps.LatLng(20.96778, -89.62426);
  //   //   this.createGoogleMap(coordinates);
  //   });
  // };

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

  // createGoogleMap = (coordinates) => {
  //   return new window.google.maps.Map(this.googleMapRef.current, {
  //     zoom: 16,
  //     center: {
  //       lat: coordinates.lat(),
  //       lng: coordinates.lng(),
  //     },
  //     disableDefaultUI: true,
  //   });
  // };

  render() {
    return (
      // <div
      //   className={classes.Map}
      //   id="google-map"
      //   ref={this.googleMapRef}
      //   // style={{ width: '400px', height: '300px' }}
      // />

      <div className={classes.Map}>
        <img alt="laphoto" src={mapphoto}/>
      </div>
    );
  }
}

export default MapContainer;
