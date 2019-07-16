import React from 'react'
import { Icon } from 'antd-mobile'
import { Route } from 'react-router-dom'
import { queryUrlParam, getLocal, isWeiXin, setLocal } from '@/utils/util'
import { getToken } from '@/api'
import '../styles/layout.scss'
import '../styles/form.scss'

export default class extends React.Component {
    constructor() {
        super()
        this.state = {
        }
    }
    componentWillMount() {
        let code = queryUrlParam(window.location.search, 'code');
        let returnPath = queryUrlParam(window.location.search, 'returnPath');
        let bgUrl = queryUrlParam(this.props.history.location.search, 'bg');
        
        if (!bgUrl) {
            if (isWeiXin()) {
                //微信浏览器需要跳转授权获取code
                let token = getLocal('_secret_wx_token')
                if (!token) {
                    if (!code) {
                        this.getAuth()
                        return;
                    } else {
                        getToken(code).then(res => {
                            token = res.data
                            setLocal('_secret_wx_token', token)
                            setTimeout(() => {
                                this.props.history.push(returnPath)
                            }, 100)
                        })
                    }
                } else {
                    this.props.history.push(returnPath)
                }
            } else {
                this.props.history.push('/powerionics/write')
            }
        }

    }
    getAuth() {
        let appid = 'wx3edc25d22618f5e9';
        // appid = 'wx77dc39692260dd64';
        let returnPath = this.props.location.pathname
        let redirectUri = encodeURIComponent('https://symy.powerionics.cn/secret/?returnPath='+returnPath);
        
        // let paramsCode = queryUrlParam(window.location.search, 'code');
        // let code = sessionStorage.getItem('code')
        // if (!paramsCode && !code) {
        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
        window.location.href = url
        // } else if(!code){
        //     sessionStorage.setItem('code', paramsCode)
        //     window.history.back()
        // }
    }
    render() {
        let token = getLocal('_secret_wx_token')
        return <div id="secret-wrap">
            {
                token?this.props.routes.map((route, index) => {
                    return <Route key={index} exact={route.exact} path={route.path} render={props => (
                        <route.component {...props} routes={route.routes} />
                    )} ></Route>
                }):<Icon type="loading"></Icon>
            }
        </div>
    }
}