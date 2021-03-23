import classes from './Explore.module.css';
import React, { Component } from 'react';

class Explore extends Component {
  searchPlacesField = () => {
    let place = this.exploreSearchBox.getPlaces();
    let placeLat = place[0].geometry.location.lat();; 
    let placeLng = place[0].geometry.location.lng();; 
    console.log(placeLat,placeLng);
    
    const queryParams = [];
    queryParams.push(encodeURIComponent('placeLat') + '=' + encodeURIComponent(placeLat));
    queryParams.push(encodeURIComponent('placeLng') + '=' + encodeURIComponent(placeLng));

    const queryString = queryParams.join('&');
    console.log(queryString);

    this.props.history.push({
        pathname:'/place',
        search:'?' + queryString
    });


      //   lat: coordinates.lat(),
      //   lng: coordinates.lng(),
    // if (places.length === 0) {
    //   alert('we did not find any places matcching that search');
    // } else {
    //   this.createMarkersForPlaces(places);
    // }
  };

    searchPlacesExplore=()=>{
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

  componentDidMount = () => {
    // check the googlescript exists
    if (!document.getElementById('googleScript')) {
      const googleMapScript = document.createElement('script');
      googleMapScript.setAttribute('id', 'googleScript');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry,places&v=weekly&key=${process.env.REACT_APP_API_KEY}`;
      googleMapScript.async = true;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener('load', () => {
        this.exploreSearchBox = new window.google.maps.places.SearchBox(document.getElementById('exploreSearchBox'));
        // 1. the user selects a prediction from the picklist
        this.exploreSearchBox.addListener('places_changed', this.searchPlacesField);
      });
    }
  };

  render() {
    return (
      <div className={classes.Header}>
        <form>
          <h1>Find Your Dreams' Place </h1>
          <div className={classes.SearchBox}>
            <input
              id="exploreSearchBox"
              className={classes.SearchPlaceInput}
              type="text"
              placeholder="Explore a place in the world"
              required
            />
            <button className={classes.SearchButton} type="button">
              Explore
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Explore;
