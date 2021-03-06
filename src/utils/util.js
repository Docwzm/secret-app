//格式化时间
const parseTime = (time, cFormat) => {
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    time = time.replace(/-/g, '/')
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
/**
* 获取queryString*
*/
const queryUrlParam = (str, name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  if (str.indexOf('?') >= 0) {
    var r = str.split("?")[1].match(reg);
    if (r != null) return (r[2]);
    return null;
  }
  return null;
}


/**
 * 本地储存
 * @param {*} key 
 * @param {*} value 
 */
const setLocal = (key, value) => {
  return window.localStorage.setItem(key, value)
}

/**
 * 获取本地储存
 * @param {*} key 
 */
const getLocal = (key) => {
  return window.localStorage.getItem(key)
}

/**
 * 移除某个本地储存
 * @param {*} key 
 */
const removeLocal = (key) => {
  return window.localStorage.removeItem(key)
}



//判断是否是微信浏览器的函数
const isWeiXin = () => {
  //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  // let ua = window.navigator.userAgent.toLowerCase();
  // if (ua.match(/MicroMessenger/i) == 'micromessenger') {// 通过正则表达式匹配ua中是否含有MicroMessenger字符串
  //   return true;
  // } else {
  //   return false;
  // }
  //限制只能微信打开
  return true
}


export {
  parseTime,
  queryUrlParam,
  setLocal,
  getLocal,
  removeLocal,
  isWeiXin
}