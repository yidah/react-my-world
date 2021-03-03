import React, { Component } from 'react';
import Map from '../Map/Map';
import Filters from '../Filters/Filters';
import classes from './Layout.module.css';

class Layout extends Component {
 
  render() {
   
    return (
      <div className={classes.Layout}>
        <Filters />
        <Map />
      </div>
    );
  }
}

export default Layout;
