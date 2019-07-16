import React from 'react'
import { createForm } from 'rc-form';
import { List, InputItem, ImagePicker, TextareaItem } from 'antd-mobile';
import { isWeiXin } from '@/utils/util'
const wx = window.wx
class PreviewForm extends React.Component {
    constructor() {
        super()
        this.state = {
            disabled: true,
            files: [],
            imgFileId: null,
            recorder: null,
            audioPlayStatus: 0,
            previewFlag: false,
            previewImgArr: [],
            previewImgIndex: 0,
            codeUrl: '',
        }
    }

    componentDidMount() {
        this.addAudioListenner()
    }

    addAudioListenner() {
        if (isWeiXin()) {
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
        } else {
            let audio = document.getElementById('my_audio')
            if (audio) {
                audio.addEventListener('ended', () => {
                    this.setState({
                        audioPlayStatus: 3
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
            audio.play()
            this.setState({
                audioPlayStatus: 1
            })
        } else if (audioPlayStatus == 1) {
            this.setState({
                audioPlayStatus: 2
            })
            audio.pause()
        } else if (audioPlayStatus == 2) {
            audio.play()
            this.setState({
                audioPlayStatus: 1
            })
        } else if (audioPlayStatus == 3) {
            audio.play()
            this.setState({
                audioPlayStatus: 1
            })
        }
    }

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
                success:() => {
                    this.setState({
                        audioPlayStatus: 0
                    })
                }
            });
        }

    }

    playAudio = () => {
        if (isWeiXin()) {
            this.playWxAudio()
        } else {
            this.playCommonAudio()
        }
    }

    render() {
        const { getFieldProps } = this.props.form;
        let { audioPlayStatus } = this.state;
        let { say_to_you, files = [], username, created_at, audioUrl, wxAudioLocalId } = this.props.formData;
        let imgUrl = files && files.length != 0 ? files[0].url : ''
        let havaAudio = isWeiXin() ? wxAudioLocalId : audioUrl
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
                            havaAudio ? <div className="audio-wrap">
                                <p onClick={this.playAudio} className={(audioPlayStatus == 1 ? 'btn end' : 'btn start')}></p>
                                {isWeiXin() ? null : <audio id="my_audio" src={audioUrl}></audio>}
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

                <List renderHeader={() => {
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

                </List>


            </form>
        )
    }
}


export default createForm()(PreviewForm)