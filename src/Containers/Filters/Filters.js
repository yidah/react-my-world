import React, { Component } from 'react';
import classes from './Filters.module.css';

class Filters extends Component {
  render() {
    return (
      <div className={classes.Filters}>
        <div className={classes.formstyle10}>
          <h1>Merida</h1>
          <form>
            <div className={classes.section}>
              <span>1</span>Search for nearby places
            </div>
            <div className={classes.innerwrap}>
              <input type="text" name="field1" />
              <input
                type="submit"
                name="DrawingTools"
                placeholder="Gluten free restaurants, petrol station, etc."
                value="Go"
              />
            </div>
            <div className={classes.section}>
              <span>2</span>Draw a shape to search within it for places
            </div>
            <div className={classes.innerwrap}>
              <input type="submit" name="DrawingTools" value="Drawing Tools" />
            </div>

            <div className={classes.section}>
              <span>3</span>Enter your favourite area
            </div>

            <div className={classes.innerwrap}>
              <div className={classes.favoriteArea}>
                <div className={classes.subgroup}>
                  <input type="text" name="field1" />
                  <input
                    type="submit"
                    name="Zoom"
                    placeholder="Gluten free restaurants, petrol station, etc."
                    value="Zoom"
                  />
                </div>

                <div className={classes.distance}>
                  <div className={classes.subgroup}>
                    <label for="distance">Within:</label>
                    <select name="distance" id="distance">
                      <option value="10">10 min</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="1">1 hour</option>
                    </select>
                  </div>

                  <div className={classes.subgroup}>
                    <select name="transit" id="transit">
                      <option value="drive">drive</option>
                      <option value="walk">walk</option>
                      <option value="bike">bike</option>
                      <option value="bus">bus</option>
                    </select>
                    <label for="distance">of:</label>
                  </div>

                </div>

                <div className={classes.subgroup}>
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
