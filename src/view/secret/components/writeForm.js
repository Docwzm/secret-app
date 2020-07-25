import React from 'react'
import { Modal, List, InputItem, Toast, ImagePicker, TextareaItem, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import Recorder from '@/utils/recorder';
import { setLocal, removeLocal, isWeiXin } from '@/utils/util'
import { uploadImage } from '@/api'
const alert = Modal.alert;
const wx = window.wx;//微信jssdk相关
class WriteForm extends React.Component {
    constructor() {
        super()
        this.state = {
            recorder: null,//h5录音用 recorder--录音对象（为了兼容h5....后面没用。移动端浏览器兼容性不好。。。。）
            audioStatus: 0,//录音状态 0-初始化状态 1-录音中 2-录音done
            time: 0, // 已经录音的时间
            limitTime: 30,//录音限制时间（秒）
        }
    }

    componentWillMount() {
        clearTimeout(this.timer)//清除录音timer
    }

    componentWillUnmount() {
        clearTimeout(this.timer)//清除录音timer
    }

    
    //兼容H5录音的玩意。。初始化h5录音api
    startUserMedia(audio_context, stream, callback) {
        let input = audio_context.createMediaStreamSource(stream);
        this.setState({
            recorder: new Recorder(input)
        }, () => {
            callback && callback()
        })
    }

    //h5暂停录音。
    stopRecording() {
        let { recorder } = this.state;
        recorder.stop();
        //导出录音二进制
        recorder.exportWAV((blob) => {
            this.props.setAudioUrl(blob)
            this.setState({
                audioStatus: 0
            })
        });
        recorder.clear();
    }
    //微信录音。。这家伙也有吭，，，录音的下载的id微信只帮你保存三天，过期就无效了  。所以必须通过服务端下载转为永久文件。
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
            //微信开始录音---这个api也有吭 不少安卓手机微信版本不是最新的 使用这个api失效
            wx.startRecord({
                success: () => {
                    this.setState({
                        audioStatus: 1,
                        startAudio: true,
                        time: 0
                    })
                    clearTimeout(this.timer)
                    //录音timer开启
                    this.timer = setInterval(() => {
                        this.setState({
                            time: this.state.time + 1
                        }, () => {
                            if (this.state.time >= this.state.limitTime) {
                                clearInterval(this.timer);
                                //时间限制到了。。终止录音
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
                },
                fail: (e) => {
                    console.log(e)
                },
                complete: (e) => {
                    console.log('complete......',e)
                }
            })

        } else {

            //正在录音中的时候点击就停止录音
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

    //h5录音。。。
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
                //开始录音
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
            //初始化h5录音 -检查api是否可用 浏览器是否兼容
            if (audioStatus == 0 && !recorder) {
                let audio_context = null
                try {
                    // webkit shim
                    window.AudioContext = window.AudioContext || window.webkitAudioContext;
                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                    window.URL = window.URL || window.webkitURL;

                    audio_context = new AudioContext;
                    //这个api兼容性不好 建议采用iframe录音
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

    //录音 区分h5和微信
    record = () => {
        if (isWeiXin()) {
            this.wxRecord()
        } else {
            this.comonRecord()
        }
    }


    //图片上传服务器
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
        let { audioStatus, recorder, time, limitTime } = this.state
        const { getFieldProps } = this.props.form;
        let { say_to_you, files = [], username, order_code, mobile, captcha_val, captcha_url } = this.props.formData;

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
                <List renderHeader={() => {
                    return (
                        <div>
                            <p className="label require">写给TA：</p>
                            <p>填写您想对TA说的话,不限字数!</p>
                        </div>
                    )
                }}>
                    <TextareaItem
                        rows="4"
                        {...getFieldProps('say_to_you', {
                            initialValue: say_to_you,
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
                        onImageClick={(index, fs) => this.props.previewImg(fs[0].url)}
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
                            initialValue: username
                        })}
                    ></InputItem>

                </List>

                <List renderHeader={() => {
                    return (
                        <div>
                            <p className="label require">powerionics淘宝或京东订单编号：</p>
                            <p>可在您的淘宝京东订单内查询复制！</p>
                        </div>
                    )
                }}>
                    <InputItem
                        {...getFieldProps('order_code', {
                            initialValue: order_code,
                            rules: [
                                { required: true, message: '请输入订单编号' }
                            ],
                        })}
                    ></InputItem>
                </List>

                <List renderHeader={() => {
                    return (
                        <div>
                            <p className="label require">手机号码：</p>
                            <p className="danger">必填项！请填写收卡人的手机号，此手机号即为对方查询留言的唯一密码，请核对无误！</p>
                        </div>
                    )
                }}>
                    <InputItem
                        type="phone"
                        placeholder="对方手机号码"
                        {...getFieldProps('mobile', {
                            initialValue: mobile,
                            rules: [
                                { required: true, message: '请输入对方手机号码' },
                            ]
                        })}
                    ></InputItem>
                </List>

                <List className="no-bg" renderHeader={() => {
                    return (
                        <div>
                            <p className="label require">验证码：</p>
                            <p>填入右边您看到的数字</p>
                        </div>
                    )
                }}>
                    <div className="code-wrap">
                        <InputItem
                            placeholder=""
                            {...getFieldProps('captcha_val', {
                                initialValue: captcha_val,
                                rules: [
                                    { required: true, message: '请输入验证码' },
                                ],
                            })}
                        ></InputItem>
                        <div className="">
                            <img className="codeImg" onClick={this.props.getCodeUrl} src={captcha_url}></img>
                        </div>
                    </div>
                </List>
            </form>
        )
    }
}


export default createForm()(WriteForm)