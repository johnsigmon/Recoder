import React, { Component } from 'react';
/*import Header from './components/Header';*/
import Footer from './components/Footer';
import Main from './containers/Main'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
   {/*       <img src={logo} className="App-logo" alt="logo" />*/}
          <h2>Recoder</h2>
        </div>
        <Main />
      </div>
    );
  }
}

export default App;
