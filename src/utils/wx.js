import { getWxConfig } from '@/api';
export function initWxConfig(config) {
    let url = window.location.href.split('#')[0]
    getWxConfig(url).then(res => {
        let {
            appId,
            timestamp,
            nonceStr,
            signature,
        } = res.data;
        window.wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId,
            timestamp,
            nonceStr,
            signature,
            jsApiList: ['translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'], // 必填，需要使用的JS接口列表
        });
    })
}