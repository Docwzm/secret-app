import React from 'react'
import { InputItem, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { queryUrlParam } from '@/utils/util'
import { getSecret } from '@/api'
import WxImageViewer from 'react-wx-images-viewer';

class CheckSecre extends React.Component {
  state = {
    check_status: 'off',
    audioUrl: '',
    audioStatus: 0,
    secretInfo: {},
    previewFlag: false,
    previewImgArr: [],
    previewImgIndex: 0
  }

  componentWillMount() {
    let phone = queryUrlParam(this.props.history.location.search, 'phone')
    if (phone) {
      this.getInfo(phone)
    }
  }


  getInfo(phone) {
    getSecret(phone).then(res => {
      this.setState({
        check_status: 'on',
        secretInfo: res.data
      })
    })
  }

  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        // this.setState({
        //   check_status: 'on'
        // })
        values.phone = values.phone.toString().replace(/\s*/g, '')
        getSecret(values.phone).then(res => {
          this.setState({
            check_status: 'on',
            secretInfo: res.data
          })
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

  componentDidMount() {
    // let audio = document.getElementById('my_audio')
    // audio.addEventListener('ended', () => {
    //   this.setState({
    //     audioStatus: 3
    //   })
    // }, false)
  }

  playAudio = () => {
    let audio = document.getElementById('my_audio')
    audio.volume = 1;
    let { audioStatus } = this.state
    if (audioStatus == 0) {
      audio.play()
      this.setState({
        audioStatus: 1
      })
    } else if (audioStatus == 1) {
      this.setState({
        audioStatus: 2
      })
      audio.pause()
    } else if (audioStatus == 2) {
      audio.play()
      this.setState({
        audioStatus: 1
      })
    } else if (audioStatus == 3) {
      audio.play()
      this.setState({
        audioStatus: 1
      })
    }

  }


  previewImg = () => {
    this.setState({
      previewFlag: true,
      previewImgArr: [this.state.secretInfo.thumb],
      previewImgIndex: 0
    })
  }

  previewClose = () => {
    this.setState({
      previewFlag: false
    })
  }

  render() {
    let { check_status, audioStatus, secretInfo, previewFlag, previewImgArr, previewImgIndex } = this.state;
    let { created_at, audio, say_to_you, thumb, username } = secretInfo
    const { getFieldProps } = this.props.form;
    return (
      <div className="secret-check-wrap">
        {
          previewFlag ? <WxImageViewer onClose={this.previewClose} urls={previewImgArr} index={previewImgIndex} /> : null
        }
        {
          check_status === 'off' ? <div className="secret-check-form-wrap">
            <div className="tip">
              <p>您的朋友随礼物还给您留了一段私言密语，您的手机号是查询留言的密码！</p>
              <p>请输入您的手机号码查看TA为您留下的私言密语......</p>
            </div>
            <form className="secret-check-form">
              <InputItem
                type="phone"
                {...getFieldProps('phone', {
                  initialValue: this.state.phone,
                  rules: [
                    { required: true, message: '请输入手机号码' },
                  ],
                })}
              >手机号码：</InputItem>
              <Button className="search-btn" size="small" type="primary" onClick={this.onSubmit}>查询</Button>
            </form>
          </div> : <div className="result">
              <div className="item">
                <p className="label">语音消息：</p>
                <p className="content light">
                  <Button onClick={this.playAudio}>{(audioStatus == 0 || audioStatus == 2) ? '播放' : (audioStatus == 3 ? '重播' : '暂停')}</Button>
                  <audio id="my_audio" src={audio}></audio>
                </p>
              </div>
              <div className="item">
                <p className="label">我想对您说：</p>
                <p className="content light">{say_to_you}</p>
              </div>
              <div className="item">
                <p className="label">永恒一刻：</p>
                <p className="content">
                  <img onClick={this.previewImg} src={thumb} />
                </p>
              </div>
              <div className="item">
                <p className="label">送卡人姓名/昵称：</p>
                <p className="content">{username}</p>
              </div>
              <div className="item">
                <p className="label">提交时间：</p>
                <p className="content">{created_at}</p>
              </div>

              <a className="url-btn" href="//www.baidu.com" target="_blank">我也要挑选礼物送TA</a>
            </div>
        }
      </div>
    )
  }
}


export default createForm()(CheckSecre)