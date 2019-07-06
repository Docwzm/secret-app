import request from '@/utils/request'

const getSecret = (mobile) => {
  return request({
    url: '/api/speech/info-mobile',
    method: 'get',
    params:{
      mobile
    }
  })
}


const saveSecret = (data) => {
  return request({
    url: '/api/speech',
    method: 'post',
    data
  })
}


/**
 * 上传语音
 * @param {*} data 
 */
const uploadAudio = (file) => {
  return request({
    url: '/static/ueditor/1.4.3.3/php/controller.php?action=uploadvideo',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: file
  })
}

/**
 * 上传图片
 * @param {*} file 
 */
const uploadImage = (file) => {
  return request({
    url: '/static/ueditor/1.4.3.3/php/controller.php?action=uploadimage',
    method: 'post',
    headers: {'Content-Type':'multipart/form-data'},
    data: file
  })
}



/**
 * 获取验证码
 */
const getCodeUrl = () => {
  return request({
    url: '/captcha/api',
    method: 'get'
  })
}



/**
 * 获取背景图片
 */
const getBgUrl = () => {
  return request({
    url: '/api/back-image',
    method: 'get'
  })
}





export {
  getSecret,
  saveSecret,
  uploadAudio,
  uploadImage,
  getCodeUrl,
  getBgUrl
}