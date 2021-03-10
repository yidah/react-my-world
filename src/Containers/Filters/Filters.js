import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Filters.module.css';
import * as mapActions from '../../store/actions/map';
import * as filterActions from '../../store/actions/filters';

class Filters extends Component {
  state = {
    nearByPlaces: '',
    favoriteArea: '',
    // withinTimePlace : ''
  };

  changeHandler = (e) => {
    this.props.setFormValues({ name: e.target.name, value: e.target.value });
  };

  getDistancesBetweenMarkersAndAddress = (response, status) => {
    if (status === 'OK') {
      let maxDuration = document.getElementById('maxDuration').value;
      let origins = response.originAddresses;
      // let destinations = response.destinationAddresses;
      let newMarkers= [...this.props.markers];
      // let atLeastOne = false;

      for (let i = 0; i < origins.length; i++) {
        let results = response.rows[i].elements;
        for (let j = 0; j < results.length; j++) {
          let element = results[j];
          let distanceText = element.distance.text;
          let durationText = element.duration.text;
          let duration = element.duration.value/60;
          // let from = origins[i];
          // let to = destinations[j];
          
          //Display markers that are within time selected
          if(duration <= maxDuration){
           newMarkers[i].setMap(this.props.map);
          //  atLeastOne = true;

           //InfoWindow that opens immediately with distance and duration 
           let infowindow = new window.google.maps.InfoWindow({
             content:durationText + ' away, ' + distanceText
           });

           infowindow.open(this.props.map,newMarkers[i]);
           newMarkers[i].infowindow= infowindow;

           //close the small window if user clicks marker 
           window.google.maps.event.addListener(newMarkers[i], 'click', ()=>{
           infowindow.close();
           })
           
            

          }
        }
      }
    } else {
      alert('Error while getting distances. The error was: ', status);
    }
  };

  SearchWithingTime = () => {
    //initialized distance matrix service
    let distanceMatrixService = new window.google.maps.DistanceMatrixService();

    let address = this.props.withinTimePlace;
    if (address === '') {
      alert('You must enter and address');
    } else {
      let origins = [];
      for (let i = 0; i < this.props.markers.length; i++) {
        origins[i] = this.props.markers[i].position;
      }
      let destination = address;
      let mode = document.getElementById('mode').value;

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
    // let nearByPlacesSearch = new window.google.maps.places.SearchBox(
    //   document.getElementById('nearByPlacesSearch'));

    return (
      <div className={classes.Filters}>
        <div className={classes.FiltersForm}>
          <h1 className={classes.FiltersExploredPlace}>Merida</h1>
          <form>
            <div className={classes.FiltersSectionTitle}>
              <span>1</span>Search for nearby places
            </div>
            <div className={classes.FiltersSectionContent}>
              <input
                type="text"
                id="nearByPlacesSearch"
                name="nearByPlaces"
                placeholder="i.e. gluten free restaurants, petrol station, etc."
              />
              <input type="submit" name="nearByPlacesGo" value="Go" />
            </div>
            <div className={classes.FiltersSectionTitle}>
              <span>2</span>Draw a shape to search within it for places
            </div>
            <div className={classes.FiltersSectionContent}>
              <input
                type="button"
                name="DrawingTools"
                value="Drawing Tools"
                onClick={() =>
                  this.props.onDrawingToolsClicked(
                    this.props.showDrawingTools ? false : true
                  )
                }
              />
            </div>

            <div className={classes.FiltersSectionTitle}>
              <span>3</span>Restrict by your favourite area
            </div>

            <div className={classes.FiltersSectionContent}>
              <div className={classes.FiltersSectionContentMultiGroup}>
                <div
                  className={classes.FiltersSectionContentMultiGroupSubGroup}
                >
                  <input
                    type="text"
                    name="favoriteArea"
                    placeholder="i.e. an area within the place you are exploring "
                  />
                  <input type="submit" name="Zoom" value="Zoom" />
                </div>

                <div className={classes.FiltersSectionContentMultiGroup}>
                  <div
                    className={classes.FiltersSectionContentMultiGroupSubGroup}
                  >
                    <label htmlFor="distance">Within:</label>
                    <select name="maxDuration" id="maxDuration">
                      <option value="10">10 min</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="60">1 hour</option>
                    </select>
                    <select name="mode" id="mode">
                      <option value="DRIVING">drive</option>
                      <option value="WALKING">walk</option>
                      <option value="BICYCLING">bicycling</option>
                      <option value="TRANSIT">bus</option>
                    </select>
                    <label htmlFor="mode">of:</label>
                  </div>
                </div>

                <div
                  className={classes.FiltersSectionContentMultiGroupSubGroup}
                >
                  <input
                    type="text"
                    name="withinTimePlace"
                    placeholder="i.e the address of your hotel"
                    onChange={this.changeHandler}
                    value={this.props.withinTimePlace}
                  />
                  {/* <input type="button" name="Go" value="Go" onClick={()=>this.props.onSearchWithingtimeGoClicked(true)}/> */}
                  <input
                    type="button"
                    name="Go"
                    value="Go"
                    onClick={this.SearchWithingTime}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showDrawingTools: state.map.showDrawingTools,
    withinTimePlace: state.filters.withinTimePlace,
    markers: state.map.markers,
    map:state.map.map
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDrawingToolsClicked: (payload) =>
      dispatch(mapActions.setDrawingTools(payload)),
    setFormValues: (payload) => dispatch(filterActions.setFormValues(payload)),
    onSearchWithingtimeGoClicked: (payload) =>
      dispatch(mapActions.setSearchWithinTime(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
