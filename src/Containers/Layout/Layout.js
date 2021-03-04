import React, { Component } from 'react';
import {connect} from 'react-redux';

import Map from '../Map/Map';
import Filters from '../Filters/Filters';
import classes from './Layout.module.css';

class Layout extends Component {
 
  render() {
   
    return (
      <div className={classes.Layout}>
        <Filters/>
        <Map showDrawingtools={this.props.drawingToolsClicked} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawingToolsClicked : state.drawingToolsClicked
  }
}

export default connect(mapStateToProps)(Layout);
