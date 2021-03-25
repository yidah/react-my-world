import React, { Component } from 'react';
import {connect} from 'react-redux';

import Map from '../Map/Map';
import Filters from '../Filters/Filters';
import classes from './Place.module.css';

class Place extends Component {
 
  render() {
   
    return (
      <div className={classes.Layout} >
        <Filters />
        {/* Need to pass router location and history as this router porperties are available only to containers under App.js where declared */}
        <Map location={this.props.location} history={this.props.history} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(Place);
