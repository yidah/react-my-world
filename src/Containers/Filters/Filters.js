import React, { Component } from 'react';
import classes from './Filters.module.css';

class Filters extends Component {
  render() {
    return (
      <div className={classes.Filters}>
        <div className={classes.FiltersForm}>
          <h1 className={classes.FiltersExploredPlace}>Merida</h1>
          <form>
            <div className={classes.FiltersSectionTitle}>
              <span>1</span>Search for nearby places
            </div>
            <div className={classes.FiltersSectionContent}>
              <input type="text" name="field1" />
              <input
                type="submit"
                name="DrawingTools"
                placeholder="Gluten free restaurants, petrol station, etc."
                value="Go"
              />
            </div>
            <div className={classes.FiltersSectionTitle}>
              <span>2</span>Draw a shape to search within it for places
            </div>
            <div className={classes.FiltersSectionContent}>
              <input type="submit" name="DrawingTools" value="Drawing Tools" />
            </div>

            <div className={classes.FiltersSectionTitle}>
              <span>3</span>Enter your favourite area
            </div>

            <div className={classes.FiltersSectionContent}>
              <div className={classes.FiltersSectionContentMultiGroup}>

                <div className={classes.FiltersSectionContentMultiGroupSubGroup}>
                  <input type="text" name="field1" />
                  <input
                    type="submit"
                    name="Zoom"
                    placeholder="Gluten free restaurants, petrol station, etc."
                    value="Zoom"
                  />
                </div>

                <div className={classes.FiltersSectionContentMultiGroup}>
                  <div className={classes.FiltersSectionContentMultiGroupSubGroup}>
                    <label for="distance">Within:</label>
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
                    <label for="distance">of:</label>
                  </div>

                </div>

                <div className={classes.FiltersSectionContentMultiGroupSubGroup}>
                  <input type="text" name="field1" />
                  <input
                    type="submit"
                    name="Go"
                    placeholder="My hotel"
                    value="Go"
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

export default Filters;
