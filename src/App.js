import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Explore from './Containers/Explore/Explore';
import Place from './Containers/Place/Place';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Route path="/" exact component={Explore}/>
        <Route path="/place" component={Place}/>
      </div>
    );
  }
}

export default App;
