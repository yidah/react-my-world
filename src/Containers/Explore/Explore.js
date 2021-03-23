import classes from './Explore.module.css';
import React, { Component } from 'react';

class Explore extends Component {
  render() {
    return (
      <div className={classes.Header}>
        <form>
          <h1>Find Your Dreams' Place </h1>
          <div className={classes.SearchBox}>
            <input
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
