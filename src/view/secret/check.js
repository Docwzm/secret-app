import React from 'react'
import { Modal, InputItem, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { getSecret, getBgUrl } from '@/api'
import WxImageViewer from 'react-wx-images-viewer';
import { staticHost2ApiHost } from '@/utils/env'
import PreviewForm from './components/previewForm'
import { isWeiXin } from '../../utils/util';
import check_bg_top from '../../assets/images/check_top_bg.jpg'
import { cacheData } from './cache'
// import { Base64 } from 'js-base64';

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
      // if(data.username){
      //   data.username = Base64.decode(data.username);
      // }
      // data.say_to_you = Base64.decode(data.say_to_you);
      if (data.rel_audio) {
        data.audioUrl = staticHost2ApiHost() + data.rel_audio.path
      }
      if (data.rel_thumb) {
        data.files = [{ url: staticHost2ApiHost() + data.rel_thumb.path }]
      }
      if (data.rel_audio) {
        cacheData.secretInfo = data;
        sessionStorage.setItem("secretInfo", JSON.stringify(data));
        setTimeout(() => {
          this.props.history.push('/powerionics/checkDetail')
        }, 100)
      } else {
        if (isWeiXin()) {
          if (data.wx_audio) {
            wx.downloadVoice({
              serverId: data.wx_audio, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: (res) => {
                data.wxAudioLocalId = res.localId
                cacheData.secretInfo = data;
                sessionStorage.setItem("secretInfo", JSON.stringify(data));
                setTimeout(() => {
                  this.props.history.push('/powerionics/checkDetail')
                }, 100)
              },
              fail: (e) => {
                // alert(JSON.stringify(e))
                // if (e.errMsg == 'downloadVoice:the permission value is offline verifying') {
                  data.wxAudioLocalId = null
                  cacheData.secretInfo = data;
                  sessionStorage.setItem("secretInfo", JSON.stringify(data));
                  setTimeout(() => {
                    this.props.history.push('/powerionics/checkDetail')
                  }, 100)
                // } else {
                //   this.setState({
                //     uploadModal: true
                //   })
                // }

              }
            });
          } else {
            cacheData.secretInfo = data;
            sessionStorage.setItem("secretInfo", JSON.stringify(data));
            setTimeout(() => {
              this.props.history.push('/powerionics/checkDetail')
            }, 100)
            // this.setState({
            //   check_status: 'on',
            //   secretInfo: data
            // })
          }
        } else {
          cacheData.secretInfo = data;
          sessionStorage.setItem("secretInfo", JSON.stringify(data));
          setTimeout(() => {
            this.props.history.push('/powerionics/checkDetail')
          }, 100)
          // this.setState({
          //   check_status: 'on',
          //   secretInfo: data
          // })
        }
      }
    }).catch(e => {
      if (e.code == 10000) {
        Toast.info(e.msg + ':' + e.data, 2)
      } else if (e.code == 20111) {
        this.setState({
          checkModal: true
        })
        // Toast.info('此手机号码暂未提交留言，请您与填卡人确认并核对手机号码是否正确！',2)
      } else {
        Toast.info(e.msg, 2)
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
        <Modal
          className='upload-modal'
          visible={this.state.uploadModal}
          transparent
          maskClosable={false}
          onClose={() => { }}
          title="语音上传失败"
          footer={[{ text: '确定', onPress: () => { this.setState({ uploadModal: false }) } }]}
        >
          <div>
          由于阁下的手机系统版本问题，语音无法上传，请改为文字图片留言！或者更换手机重新提交！谢谢您的配合！
          </div>
        </Modal>
        <Modal
          className='check-modal'
          visible={this.state.checkModal}
          transparent
          maskClosable={false}
          onClose={() => { }}
          footer={[{ text: '确定', onPress: () => { this.setState({ checkModal: false }) } }]}
        >
          <div>
            此手机号码暂未提交留言，请您与填卡人确认并核对手机号码是否正确！
          </div>
        </Modal>
        {
          previewFlag ? <WxImageViewer onClose={this.previewClose} urls={previewImgArr} index={previewImgIndex} /> : null
        }
        {
          check_status === 'off' ? <div className="secret-check-form-wrap">
            <div className="top">
              <img src={check_bg_top}></img>
            </div>
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
                <a className="url-btn" href="//powerionics.jd.com">我也要挑选礼物送TA</a>
                <span onClick={this.gotoHelpCenter} className="help-center">帮助中心</span>
              </div>
            </div>
        }

        <div className="footer-record">©2009-2019 深圳市史摩斯贸易有限公司 版权所有<br />互联网ICP备案：粤ICP备14040574号-1  </div>
      </div>
    )
  }
}


export default createForm()(CheckSecre)