import React, { Component } from 'react';
import {connect} from 'react-redux';

import classes from './Filters.module.css';
import * as mapActions from '../../store/actions/map';
import * as filterActions from '../../store/actions/filters';

class Filters extends Component {
  
  state = {
    nearByPlaces : '',
    favoriteArea : '',
    withinTimePlace : '' 
  }


  changeHandler = (e) => {
    this.props.setFormValues({name:e.target.name, value:e.target.value});
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
              <input type="text" 
                     id='nearByPlacesSearch' 
                     name="nearByPlaces" 
                     placeholder="i.e. gluten free restaurants, petrol station, etc."/>
              <input type="submit" 
                     name="nearByPlacesGo"  
                     value="Go"/>
            </div>
            <div className={classes.FiltersSectionTitle}>
              <span>2</span>Draw a shape to search within it for places
            </div>
            <div className={classes.FiltersSectionContent}>
              <input type="button" 
                     name="DrawingTools" 
                     value="Drawing Tools" 
                     onClick={() => this.props.onDrawingToolsClicked(this.props.showDrawingTools ? false : true)}/>
            </div>

            <div className={classes.FiltersSectionTitle}>
              <span>3</span>Restrict by your favourite area
            </div>

            <div className={classes.FiltersSectionContent}>
              <div className={classes.FiltersSectionContentMultiGroup}>

                <div className={classes.FiltersSectionContentMultiGroupSubGroup}>
                  <input type="text" name="favoriteArea" placeholder="i.e. an area within the place you are exploring " />
                  <input type="submit" name="Zoom" value="Zoom"/>
                </div>

                <div className={classes.FiltersSectionContentMultiGroup}>
                  <div className={classes.FiltersSectionContentMultiGroupSubGroup}>
                    <label htmlFor="distance">Within:</label>
                    <select name="distance" id="distance">
                      <option value="10">10 min</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="1">1 hour</option>
                    </select>
                    <select name="transit" id="transit">
                      <option value="drive">drive</option>
                      <option value="walk">walk</option>
                      <option value="bike">bike</option>
                      <option value="bus">bus</option>
                    </select>
                    <label htmlFor="transit">of:</label>
                  </div>

                </div>

                <div className={classes.FiltersSectionContentMultiGroupSubGroup}>
                  <input type="text" name="withinTimePlace" placeholder="i.e the address of your hotel"
                         onChange={this.changeHandler} value={this.props.withinTimePlace}/>
                  <input type="submit" name="Go" value="Go"
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

const mapStateToProps = state => {
  return {
    showDrawingTools: state.map.showDrawingTools,
    withinTimePlace:  state.filters.withinTimePlace
  }
}

const mapDispatchToProps = dispatch => {
  return{
    onDrawingToolsClicked: (payload)=> dispatch (mapActions.setDrawingTools(payload)),
    setFormValues: (payload)=> dispatch (filterActions.setFormValues(payload))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Filters);
