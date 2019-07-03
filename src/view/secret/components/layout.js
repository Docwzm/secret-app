import React from 'react'
import { Route } from 'react-router-dom'
import { queryUrlParam } from '@/utils/util'
import testBg from '@/assets/images/bg.jpg'
import {staticHost2ApiHost} from '@/utils/env'
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
        let bgUrl = queryUrlParam(this.props.history.location.search, 'bg');
        if (bgUrl) {
            this.setState({
                bgUrl
            })
        } else {
            this.getBgUrl();
        }

        this.getAuth()

    }
    getAuth() {
        // let appid = 'wx3edc25d22618f5e9';
        // let redirectUri = 'http://wwww.baidu.com';

        // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE`
    }
    getBgUrl = () => {
        getBgUrl().then(res => {
          let data = res.data;
          if(data&&data.length!=0){
            let bgUrl = staticHost2ApiHost() + data[0].rel_image.path;
            this.setState({
              bgUrl
            })
          }
        })
      }
    render() {
        const {bgUrl} = this.state
        const bgStyle = {
            backgroundImage: `url(${bgUrl})`,
        }
        return (
                bgUrl?<div id="secret-wrap" style={bgStyle}>
                {
                    this.props.routes.map((route, index) => {
                        return <Route key={index} exact={route.exact} path={route.path} render={props => (
                            <route.component {...props} routes={route.routes} />
                        )} ></Route>
                    })
                }
            </div>:null
        )
    }
}