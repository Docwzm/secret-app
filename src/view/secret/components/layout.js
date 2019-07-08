import React from 'react'
import {Icon} from 'antd-mobile'
import { queryUrlParam, getLocal, isWeiXin, setLocal } from '@/utils/util'
import { getToken } from '@/api'
export default class extends React.Component {
    constructor() {
        super()
        this.state = {
        }
    }
    componentWillMount() {
        let code = queryUrlParam(window.location.search, 'code');
        console.log(this.props.history.location)
        console.log(window.location.search)
        console.log(code)
        if (this.props.location.pathname != '/powerionics/check') {
            if (isWeiXin()) {
                //微信浏览器需要跳转授权获取code
                let token = getLocal('_secret_wx_token')
                // if (!token) {
                    if (!code) {
                        this.getAuth()
                        return;
                    } else {
                        getToken(code).then(res => {
                            token = res.data
                            setLocal('_secret_wx_token', token)
                            setTimeout(() => {
                                this.props.history.push('/powerionics/write')
                            }, 100)
                        })
                    }
                // } else {
                //     this.props.history.push('/powerionics/write')
                // }
            } else {
                this.props.history.push('/powerionics/write')
            }
        }
    }
    getAuth() {
        let appid = 'wx3edc25d22618f5e9';
        appid = 'wx77dc39692260dd64'
        let redirectUri = encodeURIComponent('http://meinvbingyue.vipgz1.idcfengye.com/secret/');
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
        return <Icon type="loading"></Icon>
    }
}