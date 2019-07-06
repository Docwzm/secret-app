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
        let code = queryUrlParam(this.props.history.location.search, 'code');
        if (this.props.location.pathname != '/powerionics/check') {
            if (isWeiXin()) {
                //微信浏览器需要跳转授权获取code
                let token = getLocal('_secret_wx_token')
                if (!token) {
                    if (!code) {
                        this.getAuth()
                        return;
                    } else {
                        getToken(code).then(res => {
                            token = res.token
                            setLocal('_secret_wx_token', token)
                            setTimeout(() => {
                                this.props.history.push('/powerionics/write')
                            }, 100)
                        })
                    }
                } else {
                    this.props.history.push('/powerionics/write')
                }
            } else {
                this.props.history.push('/powerionics/write')
            }
        }
    }
    getAuth() {
        let appid = 'wx3edc25d22618f5e9';
        let redirectUri = 'http://meinvbingyue.free.idcfengye.com/secret/';
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
    }
    render() {
        return <Icon type="loading"></Icon>
    }
}