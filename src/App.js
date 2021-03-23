import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Explore from './Containers/Explore/Explore';
import Layout from './Containers/Layout/Layout';

class App extends Component {

  render() {
    return (
      <div className="App">
        {/* <Layout /> */}
        <Route path="/" exact component={Explore}/>
        <Route path="/place" component={Layout}/>
      </div>
    );
  }
}

export default App;
