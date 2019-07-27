import React from 'react'
import { Toast, Button } from 'antd-mobile';
import { getLocal, removeLocal, parseTime, queryUrlParam, isWeiXin } from '@/utils/util'
import { saveSecret, uploadAudio, getCodeUrl, getBgUrl,valid } from '@/api'
import WxImageViewer from 'react-wx-images-viewer';
import { staticHost2ApiHost } from '@/utils/env'
import WriteForm from './components/writeForm'
import PreviewForm from './components/previewForm'
import { cacheData } from './cache';
// import { Base64 } from 'js-base64';

const wx = window.wx;
class WriteSecre extends React.Component {
  constructor() {
    super()
    this.state = {
      imgFileId: null,
      previewFlag: false,
      previewImgArr: [],
      previewImgIndex: 0,
      bgUrl: '',
      formData: {},
      audioBlod: null,
      audioUrl: ''
    }
  }

  componentWillMount() {
    let bgUrl = queryUrlParam(this.props.history.location.search, 'bg');
    if (bgUrl) {
      this.setState({
        bgUrl
      })
    } else {
      this.getBgUrl()
    }

    this.getCodeUrl()

    let myCacheData = {};

    if (cacheData.formData) {
      myCacheData = {
        havePreview: true,
        resultPreviewFlag: true,
        formData: cacheData.formData
      }
      
    }
    if(cacheData.returnUpdate){
      myCacheData.returnUpdate = true;
    }
    if(cacheData.haveCommit){
      myCacheData.haveCommit = true;
    }
    this.setState({
      ...myCacheData
    })
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

  formSubmit = () => {
    let values = Object.assign({}, this.state.formData);
    let token = getLocal('_secret_wx_token');
    if (token) {
      values.wechat_token = token
    }
    if (this.state.imgFileId) {
      values.thumb = this.state.imgFileId
    } else {
      values.thumb = 0
    }
    values.mobile = values.mobile.replace(/\s*/g, '');
    values.captcha_key = this.state.codeKey
    delete values.files
    delete values.created_at
    delete values.audioUrl
    delete values.captcha_url

    // values.say_to_you = Base64.encode(values.say_to_you)
    // if(values.username){
    //   values.username = Base64.encode(values.username)
    // }

    let func = (values) => {
      cacheData.haveCommit = true;
      this.setState({
        haveCommit: true
      })
      saveSecret(values).then(res => {
        this.props.history.push(`/success`)
      })
    }

    if (isWeiXin()) {
      if (this.state.wxAudioLocalId) {
        wx.uploadVoice({
          localId: this.state.wxAudioLocalId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: (res) => {
            values.wx_audio = res.serverId; // 返回音频的服务器端ID
            values.audio = 0
            func(values)
          }
        });
      } else {
        values.audio = 0
        func(values)
      }
    } else {
      if (this.state.audioBlod) {
        let formData = new FormData();
        formData.append('upfile', this.state.audioBlod, 'test.wav')
        uploadAudio(formData).then(data => {
          values.audio = data.id
          func(values)
        })
      } else {
        values.audio = 0
        func(values)
      }
    }


  }

  previewResult = () => {
    this.writeForm.props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        // values = Object.assign({}, this.state.formData);
        let formData = Object.assign({}, this.state.formData, { ...values, created_at: parseTime(new Date()), audioUrl: this.state.audioUrl, wxAudioLocalId: this.state.wxAudioLocalId })
        values = Object.assign({}, formData);
        let token = getLocal('_secret_wx_token');
        if (token) {
          values.wechat_token = token
        }
        if (this.state.imgFileId) {
          values.thumb = this.state.imgFileId
        } else {
          values.thumb = 0
        }
        values.mobile = values.mobile.replace(/\s*/g, '');
        values.captcha_key = this.state.codeKey
        delete values.files
        delete values.created_at
        delete values.audioUrl
        delete values.captcha_url


        let func = (values) => {
          valid(values).then(res => {
            cacheData.formData = formData
            this.setState({
              havePreview: true,
              resultPreviewFlag: true,
              formData
            })
          })
        }
    
        if (isWeiXin()) {
          if (this.state.wxAudioLocalId) {
            wx.uploadVoice({
              localId: this.state.wxAudioLocalId, // 需要上传的音频的本地ID，由stopRecord接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: (res) => {
                values.wx_audio = res.serverId; // 返回音频的服务器端ID
                values.audio = 0
                func(values)
              }
            });
          } else {
            values.audio = 0
            func(values)
          }
        } 

      } else {
        for (let x in errors) {
          let error = errors[x];
          Toast.info(error.errors[0].message, 1)
          return
        }
      }
    });
  }

  returnEdit = () => {
    cacheData.returnUpdate = true;
    this.setState({
      returnUpdate: true,
      resultPreviewFlag: false
    })
  }

  getCodeUrl = () => {
    if (!this.codeLock) {
      this.codeLock = true;
      getCodeUrl().then(res => {
        this.codeLock = false
        this.setState({
          formData: Object.assign({}, this.state.formData, { captcha_url: res.img }),
          codeKey: res.key
        })
      }).catch(e => {
        this.codeLock = false
      })
    }
  }

  setImageFile = (files, data) => {
    let imgFileId = null
    if (data) {
      imgFileId = data.id
    }
    this.setState({
      formData: Object.assign({}, this.state.formData, { files }),
      imgFileId
    })
  }

  setAudioUrl = (blob, type) => {
    if (type == 'wx') {
      this.setState({
        wxAudioLocalId: blob
      })
    } else {
      if (blob) {
        this.setState({
          audioBlod: blob,
          audioUrl: URL.createObjectURL(blob)
        })
      }
    }

  }

  render() {
    let { previewFlag, previewImgArr, previewImgIndex, bgUrl, resultPreviewFlag, formData, havePreview, returnUpdate, haveCommit } = this.state

    return (
      <div className="write-wrap">
        {
          previewFlag ? <WxImageViewer onClose={this.previewClose} urls={previewImgArr} index={previewImgIndex} /> : null
        }
        <div><img className="top-bg" src={bgUrl}></img></div>
        <div className="main">
          {
            resultPreviewFlag ? <PreviewForm previewImg={this.previewImg} formData={formData}></PreviewForm> : <WriteForm formData={formData} previewImg={this.previewImg} setImageFile={this.setImageFile} getCodeUrl={this.getCodeUrl} setAudioUrl={this.setAudioUrl} previwe wrappedComponentRef={(form) => this.writeForm = form}></WriteForm>
          }
        </div>
        <div className="footer-record">©2009-2019 深圳市史摩斯贸易有限公司 版权所有<br/>互联网ICP备案：粤ICP备14040574号-1  </div>
        <div className="fixed-bottom">
          {
            resultPreviewFlag ? <div className="wrap">
              <Button className={returnUpdate ? 'visited' : ''} onClick={this.returnEdit}>返回修改</Button>
              <Button className={haveCommit ? 'visited' : ''} onClick={this.formSubmit}>确认提交</Button>
            </div> : <Button className={havePreview ? 'visited' : ''} onClick={this.previewResult}>预览</Button>
          }
        </div>
      </div>
    )
  }
}


export default WriteSecre