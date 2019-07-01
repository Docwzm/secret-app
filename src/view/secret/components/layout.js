import React from 'react'
import { Route } from 'react-router-dom'
import { queryUrlParam } from '@/utils/util'
import testBg from '@/assets/images/bg.jpg'
import '../styles/layout.scss'
import '../styles/form.scss'

export default class extends React.Component {
    constructor() {
        super()
        this.state = {
            bgUrl: ''
        }
    }
    componentWillMount() {
        let bgUrl = queryUrlParam(this.props.history.location.search,'bg');
        if(bgUrl){
            this.setState({
                bgUrl
            })
        }else{
            this.getBgUrl();
        }

        this.getAuth()
        
    }
    getAuth(){
        
    }
    getBgUrl() {
        this.setState({
            bgUrl: ''
        })
    }
    render() {
        const bgStyle = {
            backgroundImage:`url(${this.state.bgUrl})`,
        }
        return (
            <div id="secret-wrap" style={bgStyle}>
                {
                    this.props.routes.map((route, index) => {
                        return <Route key={index} exact={route.exact} path={route.path} render={props => (
                            <route.component {...props} routes={route.routes} />
                        )} ></Route>
                    })
                }
            </div>
        )
    }
}