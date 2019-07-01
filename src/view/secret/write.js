import React from 'react'
import { List, InputItem, Toast, Button, ImagePicker, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import Recorder from '@/utils/recorder';
import { setLocal, getLocal, removeLocal } from '@/utils/util'
import { saveSecret, uploadImage, uploadAudio } from '@/api'
import WxImageViewer from 'react-wx-images-viewer';

class WriteSecre extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: true,
      files: [],
      imgFileId: null,
      recorder: null,
      audioStatus: 0,
      previewFlag:false,
      previewImgArr:[],
      previewImgIndex:0
    }
  }

  componentWillMount() {
    let cacheData = getLocal('_secret_');
    if (cacheData) {
      cacheData = JSON.parse(cacheData)
      this.setState({
        ...cacheData
      })
      removeLocal('_secret_')
    }
    clearTimeout(this.timer)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  startUserMedia(audio_context, stream, callback) {
    let input = audio_context.createMediaStreamSource(stream);
    this.setState({
      recorder: new Recorder(input)
    }, () => {
      callback && callback()
    })
  }

  stopRecording() {
    let { recorder } = this.state;
    recorder.stop();
    recorder.exportWAV((blob) => {
      this.setState({
        audioBlod: blob,
        audioUrl: URL.createObjectURL(blob),
        audioStatus: 2
      })
    });

    recorder.clear();
  }

  record = () => {
    let { audioStatus, recorder } = this.state;
    clearTimeout(this.timer)

    const func = () => {
      let { audioStatus, recorder } = this.state;
      if (audioStatus == 0 || audioStatus == 2) {
        this.setState({
          audioStatus: 1
        })
        recorder.record();
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.stopRecording()
        }, 30000)
      } else if (audioStatus == 1) {
        this.stopRecording()
      }
    }

    if (audioStatus == 0 && !recorder) {
      let audio_context = null
      try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          removeLocal('_secret_')
          this.startUserMedia(audio_context, stream, func)
        }).catch(e => {
          setLocal('_secret_', JSON.stringify(this.props.form.getFieldsValue()))
          window.location.reload();
        });
      } catch (e) {
        Toast.info('该浏览器不支持录音,请用其他浏览器打开')
      }

    } else {
      func()
    }

  }

  validateIdp = (rule, date, callback) => {
    if (date == 1) {
      callback(new Error('Invalid Date'));
    } else {
      callback();
    }
  }

  previewImg = (fs) => {
    this.setState({
      previewFlag:true,
      previewImgArr:[fs[0].url],
      previewImgIndex:0
    })
  }

  previewClose = () => {
    this.setState({
      previewFlag:false
    })
  }

  onChange = (files, type, index) => {
    if (files.length != 0) {
      let file = files[0].file;
      let formData = new FormData();
      formData.append('upfile', file)
      uploadImage(formData).then(data => {
        this.setState({
          files,
          imgFileId: data.id
        });
      })
    } else {
      this.setState({
        files,
        imgFileId: null
      });
    }
  }

  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        if(this.state.imgFileId){
          values.thumb = this.state.imgFileId
        }
        values.mobile = values.mobile.replace(/\s*/g, '');
        
        if(this.state.audioBlod){
          let formData = new FormData();
          formData.append('upfile', this.state.audioBlod, 'test.wav')
          uploadAudio(formData).then(data => {
            values.audio = data.id
            saveSecret(values).then(res => {
              this.props.history.push(`/secret/check?phone=${values.mobile}`)
            })
          })
        }else{
          saveSecret(values).then(res => {
            this.props.history.push(`/secret/check?phone=${values.mobile}`)
          })
        }
        
      } else {
        for (let x in errors) {
          let error = errors[x];
          Toast.info(error.errors[0].message)
          return
        }
      }
    });
  }

  render() {
    let { files, audioStatus, audioUrl, previewFlag, previewImgArr, previewImgIndex } = this.state
    const { getFieldProps, getFieldError } = this.props.form;

    return (
      <div>
        {
          previewFlag?<WxImageViewer onClose={this.previewClose} urls={previewImgArr} index={previewImgIndex}/>:null
        }
        <form className="secret-wirte-form">
          <List className="no-bg" renderHeader={() => {
            return (
              <div>
                <p className="label">录制语音：</p>
                <p>限30秒</p>
              </div>
            )
          }}>
            <div className="audio-wrap">
              <Button size="small" type="primary" onClick={this.record}>{audioStatus == 0 ? '开始' : (audioStatus == 1 ? '结束' : '重录')}</Button>
              {
                audioUrl ? <audio controls src={audioUrl}></audio> : null
              }
            </div>
          </List>
          <List renderHeader={() => {
            return (
              <div>
                <p className="label">我想对您说：</p>
                <p>填写您想对TA说的话，不限字数</p>
              </div>
            )
          }}>
            <TextareaItem
              rows="2"
              {...getFieldProps('say_to_you', {
                initialValue: this.state.say_to_you,
                rules: [
                  { required: true, message: '请输入对TA说的话' },
                ],
              })}
            ></TextareaItem>
          </List>

          <List className="no-bg bg-list" renderHeader={() => {
            return (
              <div>
                <p className="label">永恒一刻：</p>
                <p>选填项！上传您想分享的图片，可选择上传或不上传！</p>
              </div>
            )
          }}>
            <ImagePicker
              files={files}
              onChange={this.onChange}
              onImageClick={(index, fs) => this.previewImg(fs)}
              selectable={files.length < 1}
              multiple={false}
            />
          </List>

          <List renderHeader={() => {
            return (
              <div>
                <p className="label">送卡人姓名/昵称：</p>
                <p>选填项！如果您不想让对方知道是谁，可不填！</p>
              </div>
            )
          }}>
            <InputItem
              {...getFieldProps('username', {
                initialValue: this.state.username
              })}
            ></InputItem>

          </List>

          <List renderHeader={() => {
            return (
              <div>
                <p className="label">powerionics淘宝或京东订单编号：</p>
                <p>可在您的淘宝京东订单内查询复制！</p>
              </div>
            )
          }}>
            <InputItem
              {...getFieldProps('order_code', {
                initialValue: this.state.order_code,
                rules: [
                  { required: true, message: '请输入订单编号' }
                ],
              })}
            ></InputItem>
          </List>

          <List renderHeader={() => {
            return (
              <div>
                <p className="label">手机号码：</p>
                <p>必填项！请填写收卡人的手机号，此手机号即为对方查询留言的唯一密码，请核对无误！</p>
              </div>
            )
          }}>
            <InputItem
              type="phone"
              placeholder="对方手机号码"
              {...getFieldProps('mobile', {
                initialValue: this.state.mobile,
                rules: [
                  { required: true, message: '请输入对方手机号码' },
                ]
              })}
            ></InputItem>
          </List>

          {/* <List className="no-bg" renderHeader={() => {
            return (
              <div>
                <p className="label">验证码：</p>
              </div>
            )
          }}>
            <div className="code-wrap">
              <InputItem
                placeholder=""
                {...getFieldProps('code', {
                  initialValue: this.state.code,
                  // rules: [
                  //   { required: true, message: '' },
                  // ],
                })}
              ></InputItem>
              <div className="">1234</div>
            </div>
          </List> */}

          <Button className="fixed-bottom-btn" type="primary" onClick={this.onSubmit}>提交</Button>
        </form>
      </div>
    )
  }
}


export default createForm()(WriteSecre)