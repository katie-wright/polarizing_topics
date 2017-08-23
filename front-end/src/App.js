import React, { Component } from 'react';
import {Link} from 'react-router';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container App">
        <div className="text-center jumbotron">
          <h1> Polarizing Topics </h1>
          <p> <strong> The ice-breaker game that started over the great debate of pineapple on pizza. </strong> </p>
          <ul className="nav nav-pills nav-justified">
            <li role="presentation" ><Link to="/" className="myHeader"> About the Game </Link></li>
            <li role="presentation" ><Link to="/play" className="myHeader"> Play </Link></li>
            <li role="presentation" ><Link to="/vote" className="myHeader"> Vote or Submit Topics </Link></li>
          </ul>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
