import React from 'react'
import { Toast, Button } from 'antd-mobile';
import { getLocal, removeLocal, parseTime,queryUrlParam } from '@/utils/util'
import { saveSecret, uploadAudio, getCodeUrl, getBgUrl } from '@/api'
import WxImageViewer from 'react-wx-images-viewer';
import { staticHost2ApiHost } from '@/utils/env'
import WriteForm from './components/writeForm'
import PreviewForm from './components/previewForm'

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
    }else{
      this.getBgUrl()
    }
    
    this.getCodeUrl()
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

    let func = (values) => {
      saveSecret(values).then(res => {
        Toast.success('提交成功')
      }).catch(e => {
        removeLocal('_secret_wx_token')
        setTimeout(() => {
          this.props.history.replace(`/powerionics/write`)
        }, 100)
      })
    }

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

  previewResult = () => {
    this.writeForm.props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        this.setState({
          resultPreviewFlag: true,
          formData: Object.assign({}, this.state.formData, { ...this.writeForm.props.form.getFieldsValue(), created_at: parseTime(new Date()), audioUrl: this.state.audioUrl })
        })
      } else {
        for (let x in errors) {
          let error = errors[x];
          Toast.info(error.errors[0].message)
          return
        }
      }
    });
  }

  returnEdit = () => {
    this.setState({
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

  setAudioUrl = (blob) => {
    this.setState({
      audioBlod: blob,
      audioUrl: URL.createObjectURL(blob)
    },() => {
      this.previewResult()
    })
  }

  render() {
    let { previewFlag, previewImgArr, previewImgIndex, bgUrl, resultPreviewFlag, formData } = this.state

    return (
      <div className="write-wrap">
        {
          previewFlag ? <WxImageViewer onClose={this.previewClose} urls={previewImgArr} index={previewImgIndex} /> : null
        }
        <div><img className="top-bg" src={bgUrl}></img></div>
        <div className="main">
          {
            resultPreviewFlag ? <PreviewForm previewImg={this.previewImg} formData={formData}></PreviewForm> : <WriteForm formData={formData} previewImg={this.previewImg} setImageFile={this.setImageFile} getCodeUrl={this.getCodeUrl} setAudioUrl={this.setAudioUrl} wrappedComponentRef={(form) => this.writeForm = form}></WriteForm>
          }
        </div>
        <div className="fixed-bottom">
          {
            resultPreviewFlag ? <div className="wrap">
              <Button onClick={this.returnEdit}>返回修改</Button>
              <Button onClick={this.formSubmit}>确认提交</Button>
            </div>:null
          }
        </div>
      </div>
    )
  }
}


export default WriteSecre