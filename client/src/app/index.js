import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { ConnectMusicAppPage, EmailPage, CallbackPage } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact component={EmailPage} />
                <Route path="/connect" component={ConnectMusicAppPage} />
                <Route path="/callback" component = {CallbackPage} />
            </Switch>
        </Router>
    )
}

export default App