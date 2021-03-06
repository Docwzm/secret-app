import React from 'react'
import ReactDom from 'react-dom'
import { HashRouter as Router, Route,Redirect } from 'react-router-dom'
import routes from './routes/index'
import * as serviceWorker from './serviceWorker';
import { initWxConfig } from '@/utils/wx';
import '@/assets/styles/index.scss'
import 'lib-flexible/flexible'

initWxConfig()

ReactDom.render((
    <Router>
        {
            routes.map((route, index) => {
                return <Route key={index} exact={route.exact} path={route.path} render={props => (
                    route.redirect? <Redirect to={route.redirect}/> :<route.component {...props} routes={route.routes} />
                )}></Route>
            })
        }
    </Router>
), document.querySelector('#root'))



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();