import React from 'react'
import { createForm } from 'rc-form';
import { List, InputItem, ImagePicker, TextareaItem } from 'antd-mobile';
import { file } from '@babel/types';

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
        let audio = document.getElementById('my_audio')
        if (audio) {
            audio.addEventListener('ended', () => {
                this.setState({
                    audioPlayStatus: 3
                })
            }, false)
        }
    }

    playAudio = () => {
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

    render() {
        const { getFieldProps } = this.props.form;
        let {audioPlayStatus} = this.state;
        let { say_to_you, files = [], username, created_at, audioUrl } = this.props.formData;
        let imgUrl = files && files.length != 0 ? files[0].url : ''
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
                            audioUrl ? <div className="audio-wrap">
                                <p onClick={this.playAudio} className={(audioPlayStatus == 1 ? 'btn end' : 'btn start')}></p>
                                <audio id="my_audio" src={audioUrl}></audio>
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