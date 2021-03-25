import classes from './Explore.module.css';
import React, { Component } from 'react';

class Explore extends Component {

  searchPlacesField = () => {
    let place = this.exploreSearchBox.getPlaces();
    let placeLat = place[0].geometry.location.lat(); 
    let placeLng = place[0].geometry.location.lng();
    let placeIcon = place[0].icon;
    let placeName = place[0].name;
    let placeId = place[0].Id
    
    const queryParams = [];
    queryParams.push(encodeURIComponent('placeLat') + '=' + encodeURIComponent(placeLat));
    queryParams.push(encodeURIComponent('placeLng') + '=' + encodeURIComponent(placeLng));
    queryParams.push(encodeURIComponent('placeName') + '=' + encodeURIComponent(placeName));
    queryParams.push(encodeURIComponent('placeId') + '=' + encodeURIComponent(placeId));
    queryParams.push(encodeURIComponent('placeIcon') + '=' + encodeURIComponent(placeIcon));
    const queryString = queryParams.join('&');

    this.props.history.push({
        pathname:'/place',
        search:'?' + queryString
    });
  };

    searchPlacesExplore=()=>{
      let placeName = document.getElementById('exploreSearchBox').value;
            
      const queryParams = [];
      queryParams.push(encodeURIComponent('placeName') + '=' + encodeURIComponent(placeName));
      const queryString = queryParams.join('&');
  
      this.props.history.push({
          pathname:'/place',
          search:'?' + queryString
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
            <button className={classes.SearchButton} type="button" onClick={this.searchPlacesExplore}>
              Explore
            </button>
          </div>
        </form>
      </div>
    );
  }
}



export default Explore;
