import React from 'react'
import { createForm } from 'rc-form';
import { List } from 'antd-mobile';
import {staticHost2ApiHost} from '@/utils/env'
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

    getAudioLinkStatus() {
        let { wx_audio_link, wxAudioLocalId } = this.props.formData;
        if (wx_audio_link) {
            return 2
        } else if (wxAudioLocalId) {
            return 1
        } else {
            return 0
        }
    }

    componentDidMount() {
        this.addAudioListenner()
    }

    addAudioListenner() {
        let audioLinkStatus = this.getAudioLinkStatus();
        if (audioLinkStatus == 1) {
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
            audio.play()
            this.setState({
                audioPlayStatus: 1
            })
        } else if (audioPlayStatus == 1) {
            this.setState({
                audioPlayStatus: 0
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
                success: () => {
                    this.setState({
                        audioPlayStatus: 0
                    })
                }
            });
        }

    }

    playAudio = () => {
        if (this.getAudioLinkStatus() == 1) {
            this.playWxAudio()
        } else {
            this.addAudioListenner()
            this.playCommonAudio()
        }
    }

    render() {
        let { audioPlayStatus } = this.state;
        let { wx_audio_link } = this.props.formData;
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
                        {
                            audioLinkStatus != 0 ? <div className="audio-wrap">
                                <p onClick={this.playAudio} className={(audioPlayStatus == 1 ? 'btn end' : 'btn start')}></p>
                                {audioLinkStatus == 2 ? <audio id="my_audio" src={staticHost2ApiHost()+wx_audio_link}></audio> : null}
                            </div> : null
                        }
                    </div>
                </List>
            </form>
        )
    }
}


export default createForm()(PreviewForm)