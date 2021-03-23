import React, { Component } from 'react';
import Explore from './Containers/Explore/Explore';
import Layout from './Containers/Layout/Layout';

class App extends Component {

  render() {
    return (
      <div className="App">
        {/* <Layout /> */}
        <Explore/>
      </div>
    );
  }
}

export default App;
