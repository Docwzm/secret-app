import React from 'react'
import { InputItem, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { getSecret, getBgUrl } from '@/api'
import WxImageViewer from 'react-wx-images-viewer';
import { staticHost2ApiHost } from '@/utils/env'
import PreviewForm from './components/previewForm'
import { isWeiXin } from '../../utils/util';
const wx = window.wx
class CheckSecre extends React.Component {
  state = {
    check_status: 'off',
    audioUrl: '',
    audioStatus: 0,
    secretInfo: {},
    previewFlag: false,
    previewImgArr: [],
    previewImgIndex: 0,
    bgUrl: ''
  }

  componentWillMount() {
    this.getBgUrl()
  }

  getBgUrl = () => {
    getBgUrl().then(res => {
      let data = res.data;
      if (data && data.length != 0) {
        let bgUrl = staticHost2ApiHost() + data[0].rel_image.path;
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
      if(isWeiXin()){
        if (data.wx_audio) {
          wx.downloadVoice({
            serverId: data.wx_audio, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: (res) => {
              data.wxAudioLocalId = res.localId
              this.setState({
                check_status: 'on',
                secretInfo: data
              })
            },
            fail: (e) => {
            }
          });
        } else {
          this.setState({
            check_status: 'on',
            secretInfo: data
          })
        }
      }else{
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
      <div className="secret-check-wrap">
        {
          previewFlag ? <WxImageViewer onClose={this.previewClose} urls={previewImgArr} index={previewImgIndex} /> : null
        }
        {
          check_status === 'off' ? <div className="secret-check-form-wrap">
            <div className="top"></div>
            <div className="main">
              <div className="tip">
                <p>您的朋友随礼物还给您留了一段私言密语，您的手机号是查询留言的密码！</p>
                <p>请输入您的手机号码查看TA为您留下的私言密语......</p>
              </div>
              <form className="secret-check-form">
                <div className="label">输入你的手机号码</div>
                <InputItem
                  type="phone"
                  {...getFieldProps('phone', {
                    initialValue: this.state.phone,
                    rules: [
                      { required: true, message: '请输入手机号码' },
                    ],
                  })}
                ></InputItem>
                <Button className="search-btn" size="small" onClick={this.onSubmit}>查看</Button>
              </form>
            </div>
          </div> : <div className="result">
              <div className="top"><img src={bgUrl}></img></div>
              <PreviewForm previewImg={this.previewImg} formData={secretInfo}></PreviewForm>
              <div className="fixed-bottom">
                <a className="url-btn" href="//powerionics.jd.com" target="_blank">我也要挑选礼物送TA</a>
                <span onClick={this.gotoHelpCenter} className="help-center">帮助中心</span>
              </div>
            </div>
        }
      </div>
    )
  }
}


export default createForm()(CheckSecre)