import React from 'react'
import { Modal, List, InputItem, Toast, ImagePicker, TextareaItem, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import Recorder from '@/utils/recorder';
import { setLocal, removeLocal, isWeiXin } from '@/utils/util'
import { uploadImage } from '@/api'
const alert = Modal.alert;
const wx = window.wx;
class WriteForm extends React.Component {
    constructor() {
        super()
        this.state = {
            recorder: null,
            audioStatus: 0,
            time: 0,
            limitTime: 30,
        }
    }

    componentWillMount() {
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
            this.props.setAudioUrl(blob)
            this.setState({
                audioStatus: 0
            })
        });
        recorder.clear();
    }

    wxRecord() {
        let { audioStatus, time, limitTime } = this.state;
        clearTimeout(this.timer)
        // if (time >= limitTime) {
        //     alert('', `您的录音已经超过${limitTime}秒，是否重新录制？`, [
        //         { text: '否', onPress: () => {}},
        //         {
        //             text: '是', onPress: () => {
        //                 this.setState({
        //                     time: 0
        //                 }, () => {
        //                     this.wxRecord()
        //                 })
        //             }
        //         },
        //     ])
        // } else {
        if (audioStatus == 0 || audioStatus == 2) {
            wx.startRecord({
                success: () => {
                    this.setState({
                        audioStatus: 1,
                        startAudio: true,
                        time: 0
                    })
                    clearTimeout(this.timer)
                    this.timer = setInterval(() => {
                        this.setState({
                            time: this.state.time + 1
                        }, () => {
                            if (this.state.time >= this.state.limitTime) {
                                clearInterval(this.timer);
                                wx.stopRecord({
                                    success: (res) => {
                                        this.setState({
                                            audioStatus: 0
                                        })
                                        this.props.setAudioUrl(res.localId, 'wx')
                                    }
                                })
                            }
                        })
                    }, 1000)
                }
            })

        } else {
            clearTimeout(this.timer)
            wx.stopRecord({
                success: (res) => {
                    this.setState({
                        audioStatus: 0
                    })
                    this.props.setAudioUrl(res.localId, 'wx')
                },
                fail: (e) => {
                }
            })
        }
        // }
    }

    comonRecord = () => {
        let { audioStatus, recorder } = this.state;
        clearTimeout(this.timer)
        // return false;
        const func = () => {
            let { audioStatus, recorder } = this.state;
            if (audioStatus == 0 || audioStatus == 2) {
                this.setState({
                    audioStatus: 1,
                    time: 0,
                    startAudio: true
                })
                recorder.record();
                clearTimeout(this.timer)
                this.timer = setInterval(() => {
                    this.setState({
                        time: this.state.time + 1
                    }, () => {
                        if (this.state.time >= this.state.limitTime) {
                            clearInterval(this.timer);
                            this.stopRecording()
                        }
                    })
                }, 1000)
            } else if (audioStatus == 1) {
                this.stopRecording()
            }
        }
        if (this.state.time >= this.state.limitTime) {

            alert('', `您的录音已经超过${this.state.limitTime}秒，是否重新录制？`, [
                { text: '否', onPress: () => { } },
                {
                    text: '是', onPress: () => {
                        this.setState({
                            time: 0
                        }, () => {
                            recorder.clear();
                            this.record()
                        })
                    }
                },
            ])

        } else {
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
                    Toast.info('该浏览器不支持录音,请用其他浏览器或者微信打开')
                }

            } else {
                func()
            }
        }
    }

    record = () => {
        if (isWeiXin()) {
            this.wxRecord()
        } else {
            this.comonRecord()
        }
    }

    onChange = (files, type, index) => {
        if (files.length != 0) {
            let file = files[0].file;
            let formData = new FormData();
            formData.append('upfile', file)
            uploadImage(formData).then(data => {
                this.props.setImageFile(files, data)
            })
        } else {
            this.props.setImageFile(files)

        }
    }

    render() {
        let { audioStatus, time,limitTime } = this.state

        const filterTime = (time) => {
            if (time < 10) {
                time = '0' + time
            }
            return time
        }

        return (
            <form className="my-form wirte-form">
                <List className="audio-list" renderHeader={() => {
                    return (
                        <div className="audio-label-wrap">
                            <p className="label">我想对您说：</p>
                            <p>可选项,录制您想对TA说的话,限{limitTime}秒内!</p>
                            {
                                audioStatus == 1 ? <p className="tip">录音中 00:{filterTime(time)}</p> : (this.state.startAudio ? <p className="tip">已录音 00:{filterTime(time)}</p> : null)
                            }
                        </div>
                    )
                }}>
                    <div className="audio-wrap">
                        <p onClick={this.record} className={audioStatus == 0 ? 'btn start' : 'btn pause'}></p>
                    </div>
                </List>
            </form>
        )
    }
}


export default createForm()(WriteForm)