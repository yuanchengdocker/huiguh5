import React from 'react'
import ReactDom from 'react-dom'
import {HashRouter, Switch, BrowserRouter as Router, Route, Link,NavLink} from 'react-router-dom'
import page from './config/router'

class App extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div style={{height: '100%'}}>
                <NavLink to="/page1">page1</NavLink>
                <NavLink to="/page2">page2</NavLink>
			</div>
        )
    }
}

const render = Component => {
	ReactDom.render(
        <Router>
            <Component comp={App}/>
        </Router>
	  ,document.getElementById('root'),
	)
}
  
render(page);
