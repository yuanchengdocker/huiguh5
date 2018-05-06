import { Component } from 'react'
import React from 'react'
import {HashRouter, Switch, BrowserRouter, Route, Redirect,NavLink} from 'react-router-dom'

import routes from './routes'

export default class RouteConfig extends Component{
    render(){
        return (
            <BrowserRouter basename="/build/reactpage">
                <div>
                <this.props.comp/>
                <Switch>
                    <Route path="/" exact component={routes.page1} />
                    <Route path="/page1" exact  component={routes.page1} />
                    <Route path="/page2" exact  component={routes.page2} />
                    <Redirect to="/" />
                </Switch>
                </div>
            </BrowserRouter>
        )
    }
}