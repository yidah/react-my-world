import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Filters.module.css';
import * as mapActions from '../../store/actions/map';
import * as filterActions from '../../store/actions/filters';

class Filters extends Component {

  changeHandler = (e) => {
    this.props.setFormValues({ name: e.target.name, value: e.target.value });
  };

  render() {
    return (
      <div id="filtersDiv" className={classes.Filters}>
        <div className={classes.FiltersForm}>
          <h1 className={classes.FiltersExploredPlace}>{this.props.exploredPlaceName}</h1>
          <form>
            <div className={classes.FiltersSectionTitle}>
              <span>1</span>Search for nearby places
            </div>
            <div className={classes.FiltersSectionContent}>
              <input
                type="text"
                id="nearByPlacesSearchBox"
                name="nearByPlaces"
                placeholder="i.e. gluten free restaurants, petrol station, etc."
                // THIS IS HANDLED IN MAPS AS THIS CONTROL IS LINKED TO SEARCHBOX GOOGLE CONTROL
                // onChange={this.changeHandler}
                // value={this.props.nearByPlacesSearch}
              />
              <input type="button" 
                     name="nearByPlacesGoSearch" 
                     value="Go" 
                     onClick={()=>this.props.setNearbyPlaceGoSearch(true)}/>
            </div>
            <div className={classes.FiltersSectionTitle}>
              <span>2</span>Draw a shape to search within it for places
            </div>
            <div className={classes.FiltersSectionContent}>
              <input
                type="button"
                name="DrawingTools"
                value="Drawing Tools"
                onClick={() =>this.props.setDrawingTools(!this.props.showDrawingTools)}
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
                    <label htmlFor="distance">Within:</label>
                    <select
                      name="maxDuration"
                      id="maxDuration"
                      onChange={this.changeHandler}
                      value={this.props.maxDuration}
                    >
                      <option value="10">10 min</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="60">1 hour</option>
                    </select>
                    <select
                      name="mode"
                      id="mode"
                      onChange={this.changeHandler}
                      value={this.props.mode}
                    >
                      <option value="DRIVING">drive</option>
                      <option value="WALKING">walk</option>
                      <option value="BICYCLING">bicycling</option>
                      <option value="TRANSIT">bus</option>
                    </select>
                   
                  </div>

                  <div
                    className={classes.FiltersSectionContentMultiGroupSubGroup}
                  >
                     <label htmlFor="mode">of:</label>
                    <input
                      type="text"
                      id="withinTimePlace"
                      name="withinTimePlace"
                      placeholder="i.e the address of your hotel"
                      // THIS IS HANDLED IN MAPS AS THIS CONTROL IS LINKED TO SEARCHBOX GOOGLE CONTROL
                      // onChange={this.changeHandler}
                      // value={this.props.withinTimePlace}
                    />
                    <input
                      type="button"
                      name="Go"
                      value="Go"
                      onClick={()=>this.props.setSearchWithinTime(true)}
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
    exploredPlaceName: state.map.exploredPlaceName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDrawingTools: (payload) => dispatch(mapActions.setDrawingTools(payload)),
    setFormValues: (payload) => dispatch(filterActions.setFormValues(payload)),
    setSearchWithinTime: (payload) => dispatch(mapActions.setSearchWithinTime(payload)),
    setNearbyPlaceGoSearch: (payload) => dispatch(mapActions.setNearbyPlaceGoSearch(payload)),
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
