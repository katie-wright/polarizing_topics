import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Home from './components/Home';
import Play from './components/Play';
import VoteSubmit from './components/VoteSubmit';

ReactDOM.render(
    <Router history={browserHistory} >
        <Route path='/' component={App}>
            <IndexRoute component={Home} />
            <Route path='/play' component={Play} />
            <Route path='/vote' component={VoteSubmit} />
            <Route path='/home' component={Home} />
        </Route>
    </Router>
, document.getElementById('root'));
registerServiceWorker();
