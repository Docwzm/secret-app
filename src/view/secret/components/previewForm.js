import React from 'react'
import { createForm } from 'rc-form';
import { List, InputItem, ImagePicker, TextareaItem } from 'antd-mobile';
import { isWeiXin } from '@/utils/util'
import {staticHost2ApiHost} from '@/utils/env'
const wx = window.wx
class PreviewForm extends React.Component {
    constructor() {
        super()
        this.state = {
            files: [],//图片数组
            audioPlayStatus: 0,//语音播放状态 0-初始化状态/暂停 1-播放中 2-播放done
            previewFlag: false,//图片预览标识
            previewImgArr: [],//预览图片数组
            previewImgIndex: 0//预览图片index
        }
    }
    //获取录音状态
    getAudioLinkStatus() {
        let { wx_audio_link, wxAudioLocalId } = this.props.formData;
        if (wx_audio_link) {
            return 2 //已转永久文件（页面播放为h5播放）
        } else if (wxAudioLocalId) {
            return 1 //有录音 但是还未转永久文件
        } else {
            return 0 //无录音
        }
    }

    componentDidMount() {
        this.addAudioListenner()//监听音频播放结束事件
    }

    addAudioListenner() {
        let audioLinkStatus = this.getAudioLinkStatus();
        if (audioLinkStatus == 1) {
            //微信音频播放结束事件监听
            wx.onVoicePlayEnd({
                success: (res) => {
                    // wx.stopVoice({
                    //     localId: res.localId,
                    // });
                    this.setState({
                        audioPlayStatus: 0
                    })
                }
            });
        } else if (audioLinkStatus == 2) {
            //h5监听音频播放结束事件。。。。
            let audio = document.getElementById('my_audio')
            if (audio) {
                audio.addEventListener('ended', () => {
                    this.setState({
                        audioPlayStatus: 0
                    })
                }, false)
            }
        }
    }

    playCommonAudio = () => {
        let audio = document.getElementById('my_audio')
        audio.volume = 1;
        let { audioPlayStatus } = this.state
        if (audioPlayStatus == 0) {
            //开始播放
            audio.play()
            this.setState({
                audioPlayStatus: 1
            })
        } else if (audioPlayStatus == 1) {
            //暂停
            this.setState({
                audioPlayStatus: 0
            })
            audio.pause()
        } else if (audioPlayStatus == 2) {
            //重新播放
            audio.play()
            this.setState({
                audioPlayStatus: 1
            })
        } else if (audioPlayStatus == 3) {
            //重新播放
            audio.play()
            this.setState({
                audioPlayStatus: 1
            })
        }
    }

    //播放暂停微信id录音
    playWxAudio = () => {
        let { wxAudioLocalId } = this.props.formData
        let { audioPlayStatus } = this.state;
        if (audioPlayStatus == 0) {
            wx.playVoice({
                localId: wxAudioLocalId,
                success: () => {
                    this.setState({
                        audioPlayStatus: 1
                    })
                }
            });

        } else {
            wx.pauseVoice({
                localId: wxAudioLocalId,
                success: () => {
                    this.setState({
                        audioPlayStatus: 0
                    })
                }
            });
        }

    }
    //播放录音
    playAudio = () => {
        if (this.getAudioLinkStatus() == 1) {
            //如果有录音 而且录音还未转永久文件 则使用微信播放api
            this.playWxAudio()
        } else {
            this.addAudioListenner()
            this.playCommonAudio()
        }
    }

    render() {
        const { getFieldProps } = this.props.form;
        let { audioPlayStatus } = this.state;
        let { say_to_you, files = [], username, created_at, audioUrl, wxAudioLocalId, wx_audio_link } = this.props.formData;
        let imgUrl = files && files.length != 0 ? files[0].url : ''
        let audioLinkStatus = this.getAudioLinkStatus()
        return (
            <form className="my-form preview-form">
                <List className="audio-list" renderHeader={() => {
                    return (
                        <div>
                            <p className="label">我想对您说：</p>
                        </div>
                    )
                }}>
                    <div>
                        <p className="word-wrap">{say_to_you}</p>
                        {
                            audioLinkStatus != 0 ? <div className="audio-wrap">
                                <p onClick={this.playAudio} className={(audioPlayStatus == 1 ? 'btn end' : 'btn start')}></p>
                                {audioLinkStatus == 2 ? <audio id="my_audio" src={staticHost2ApiHost()+wx_audio_link}></audio> : null}
                            </div> : null
                        }
                    </div>
                </List>

                {
                    imgUrl ? <List className="no-bg bg-list" renderHeader={() => {
                        return (
                            <div>
                                <p className="label">永恒一刻：</p>
                            </div>
                        )
                    }}>
                        <div className="preview-img"><img onClick={() => this.props.previewImg(imgUrl)} src={imgUrl}></img></div>
                    </List> : null
                }

                {
                    username ? <List renderHeader={() => {
                        return (
                            <div>
                                <p className="label">送卡人姓名/昵称：</p>
                            </div>
                        )
                    }}>
                        <InputItem
                            {...getFieldProps('username', {
                                initialValue: username
                            })}
                        ></InputItem>

                    </List> : null
                }

                {/* <List renderHeader={() => {
                    return (
                        <div>
                            <p className="label">发送时间：</p>
                        </div>
                    )
                }}>
                    <InputItem
                        {...getFieldProps('created_at', {
                            initialValue: created_at
                        })}
                    ></InputItem>

                </List> */}


            </form>
        )
    }
}


export default createForm()(PreviewForm)