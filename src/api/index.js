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
 * codeComit
 */
const commitCode = ({val,key}) => {
  return request({
    url: '/api/test',
    method: 'get',
    data: {
      val,
      key
    }
  })
}


export {
  getSecret,
  saveSecret,
  uploadAudio,
  uploadImage,
  commitCode
}