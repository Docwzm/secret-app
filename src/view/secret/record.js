import React from 'react'
import { Modal, InputItem, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { staticHost2ApiHost } from '@/utils/env'
import PreviewForm from './components/previewRecordForm'
import check_bg_top from '../../assets/images/check_top_bg.jpg'
import { cacheData } from './cache'
import { getLocal, removeLocal, parseTime, queryUrlParam, isWeiXin } from '@/utils/util'
import { updateRecord, uploadAudio, getBgUrl, valid, getSecret } from '@/api'
import WriteForm from './components/recordForm'
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
    bgUrl: '',
    flag:false
  }

  componentWillMount() {
    this.getBgUrl()
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
      let recordId = res.data && res.data.id
      this.setState({
        recordId,
        flag:true
      })
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

  formSubmit = () => {
    let values = {
      id:this.state.recordId,
      audio:0,
    };

    let func = (values) => {
      cacheData.haveCommit = true;
      this.setState({
        haveCommit: true
      })
      updateRecord(this.state.recordId,values).then(res => {
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
            func(values)
          },
          fail: (res) => {
            this.setState({ uploadModal: true })
          }
        });
      } else {
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
        let formData = Object.assign({}, this.state.formData, {audioUrl: this.state.audioUrl, wxAudioLocalId: this.state.wxAudioLocalId })

        let func = (values) => {
            cacheData.formData = formData
            this.setState({
              havePreview: true,
              resultPreviewFlag: true,
              formData
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
              },
              fail: (res) => {
                this.setState({ uploadModal: true })
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
    let { check_status, secretInfo, flag, previewFlag, previewImgArr, previewImgIndex, bgUrl, resultPreviewFlag, formData, havePreview, returnUpdate, haveCommit } = this.state;
    const { getFieldProps } = this.props.form;
    return <div>
      {
        flag ? <div className="write-wrap">
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
              请检查您的微信版本并升级至最新
          </div>
          </Modal>
          <div><img className="top-bg" src={bgUrl}></img></div>
          <div className="main">
            {
              resultPreviewFlag ? <PreviewForm previewImg={this.previewImg} formData={formData}></PreviewForm> : <WriteForm formData={formData} previewImg={this.previewImg} setImageFile={this.setImageFile} getCodeUrl={this.getCodeUrl} setAudioUrl={this.setAudioUrl} previwe wrappedComponentRef={(form) => this.writeForm = form}></WriteForm>
            }
          </div>
          <div className="footer-record">©2009-2019 深圳市史摩斯贸易有限公司 版权所有<br />互联网ICP备案：粤ICP备14040574号-1  </div>
          <div className="fixed-bottom">
            {
              resultPreviewFlag ? <div className="wrap">
                <Button className={returnUpdate ? 'visited' : ''} onClick={this.returnEdit}>返回修改</Button>
                <Button className={haveCommit ? 'visited' : ''} onClick={this.formSubmit}>确认提交</Button>
              </div> : <Button className={havePreview ? 'visited' : ''} onClick={this.previewResult}>预览</Button>
            }
          </div>
        </div> : <div className="secret-check-wrap">
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
            <div className="secret-check-form-wrap">
              <div className="top">
                <img src={check_bg_top}></img>
              </div>
              <div className="main">
                <div className="tip">
                  <p>请输入原先填写的收卡人手机号码</p>
                </div>
                <form className="secret-check-form">
                  <div className="label">请输入原先填写的收卡人手机号码</div>
                  <InputItem
                    type="phone"
                    {...getFieldProps('phone', {
                      initialValue: this.state.phone,
                      rules: [
                        { required: true, message: '请输入手机号码' },
                      ],
                    })}
                  ></InputItem>
                  <Button className="search-btn" size="small" onClick={this.onSubmit}>确定</Button>
                </form>
              </div>
            </div>
            <div className="footer-record">©2009-2019 深圳市史摩斯贸易有限公司 版权所有<br />互联网ICP备案：粤ICP备14040574号-1  </div>
          </div>
      }
    </div>


  }
}


export default createForm()(CheckSecre)