import React from 'react'
import { InputItem, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { getSecret, getBgUrl } from '@/api'
import WxImageViewer from 'react-wx-images-viewer';
import { staticHost2ApiHost } from '@/utils/env'
import PreviewForm from './components/previewForm'
import { isWeiXin } from '../../utils/util';
import check_bg_top from '../../assets/images/check_top_bg.jpg'
import { cacheData } from './cache'
const wx = window.wx
class CheckSecre extends React.Component {
  state = {
    check_status: 'off',
    audioUrl: '',
    audioStatus: 0,
    secretInfo: null,
    previewFlag: false,
    previewImgArr: [],
    previewImgIndex: 0,
    bgUrl: ''
  }

  componentWillMount() {
    if (sessionStorage.getItem('check_top_bg')) {
      this.setState({
        bgUrl: sessionStorage.getItem('check_top_bg')
      })
    } else {
      this.getBgUrl()
    }
    if (cacheData.secretInfo || sessionStorage.getItem("secretInfo")) {
      let secretInfo = cacheData.secretInfo || JSON.parse(sessionStorage.getItem("secretInfo"));
      this.setState({
        check_status: 'on',
        secretInfo
      })
    } else {
      this.props.history.replace('/powerionics/check')
    }
  }

  getBgUrl = () => {
    getBgUrl().then(res => {
      let data = res.data;
      if (data && data.length != 0) {
        let bgUrl = staticHost2ApiHost() + data[0].rel_image.path;
        sessionStorage.setItem('check_top_bg', bgUrl)
        this.setState({
          bgUrl
        })
      }
    })
  }

  getInfo(phone) {
    getSecret(phone).then(res => {
      let data = res.data;
      if (data.rel_audio) {
        data.audioUrl = staticHost2ApiHost() + data.rel_audio.path
      }
      if (data.rel_thumb) {
        data.files = [{ url: staticHost2ApiHost() + data.rel_thumb.path }]
      }
      if (isWeiXin()) {
        if (data.wx_audio) {
          wx.downloadVoice({
            serverId: data.wx_audio, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: (res) => {
              data.wxAudioLocalId = res.localId
              sessionStorage.setItem("secretInfo", JSON.stringify(data));
              this.setState({
                check_status: 'on',
                secretInfo: data
              })
            },
            fail: (e) => {
            }
          });
        } else {
          sessionStorage.setItem("secretInfo", JSON.stringify(data));
          this.setState({
            check_status: 'on',
            secretInfo: data
          })
        }
      } else {
        sessionStorage.setItem("secretInfo", JSON.stringify(data));
        this.setState({
          check_status: 'on',
          secretInfo: data
        })
      }
    })
  }

  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        // this.setState({
        //   check_status: 'on'
        // })
        values.phone = values.phone.toString().replace(/\s*/g, '')
        this.getInfo(values.phone)
      } else {
        for (let x in errors) {
          let error = errors[x];
          Toast.info(error.errors[0].message)
          return
        }
      }
    });
  }


  previewImg = (url) => {
    this.setState({
      previewFlag: true,
      previewImgArr: [url],
      previewImgIndex: 0
    })
  }

  previewClose = () => {
    this.setState({
      previewFlag: false
    })
  }

  gotoHelpCenter = () => {
    this.props.history.push('/helpCenter')
  }

  render() {
    let { check_status, secretInfo, previewFlag, previewImgArr, previewImgIndex, bgUrl } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div className="secret-check-wrap result-wrap">
        {
          previewFlag ? <WxImageViewer onClose={this.previewClose} urls={previewImgArr} index={previewImgIndex} /> : null
        }
        {
          secretInfo ? <div className="result">
            <div className="top"><img src={bgUrl}></img></div>
            <PreviewForm previewImg={this.previewImg} formData={secretInfo}></PreviewForm>
            <div className="fixed-bottom">
              <a className="url-btn" href="//powerionics.jd.com">我也要挑选礼物送TA</a>
              <span onClick={this.gotoHelpCenter} className="help-center">帮助中心</span>
            </div>
          </div> : null
        }
        <div className="footer-record">©2009-2019 深圳市史摩斯贸易有限公司 版权所有<br/>互联网ICP备案：粤ICP备14040574号-1  </div>
      </div>
    )
  }
}


export default createForm()(CheckSecre)