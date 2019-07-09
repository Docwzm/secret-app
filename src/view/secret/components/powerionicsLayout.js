import React from 'react'
import { Route } from 'react-router-dom'
import { queryUrlParam, getLocal, isWeiXin } from '@/utils/util'
import { staticHost2ApiHost } from '@/utils/env'
import { getBgUrl } from '@/api'
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
        // let bgUrl = queryUrlParam(this.props.history.location.search, 'bg');
        
        // if (bgUrl) {
        //     this.setState({
        //         bgUrl
        //     })
        // } else {
        //     this.getBgUrl();
            if (this.props.location.pathname != '/powerionics/check') {
                if (isWeiXin()) {
                    //微信浏览器需要跳转授权获取code
                    let token = getLocal('_secret_wx_token')
                    if (!token) {
                        this.props.history.push('/')
                        return;
                    }
                }
            }
        // }

    }

   
    render() {
        // const { bgUrl } = this.state
        // const bgStyle = {
        //     backgroundImage: `url(${bgUrl})`,
        // }
        return (
            <div id="secret-wrap">
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