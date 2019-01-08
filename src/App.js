import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';

import { Landing } from './Pages/Landing';
import { Dashboard } from './Pages/Dashboard';
import { History } from './Pages/History';
import { Leaderboard } from './Pages/Leaderboard';
import { Profile, OtherProfile } from './Pages/Profile';
import { Tournament } from './Pages/Tournament';
import { Wallet } from './Pages/Wallet';
import { NotFound } from './Pages/NotFound'
class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/history' component={History} />
        <Route path='/leaderboard' component={Leaderboard} />
        <Route path='/profile' component={Profile} />
        <Route path='/profileOther' component={OtherProfile} />
        <Route path='/tournament' component={Tournament} />
        <Route path='/wallet' component={Wallet} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}


export default App;
