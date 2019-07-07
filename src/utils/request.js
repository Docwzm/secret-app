import axios from 'axios'
import { staticHost2ApiHost } from './env'
import { Toast } from 'antd-mobile';
// axios.defaults.withCredentials = true;

let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (config) => {
    for(let p in pending){
        if(pending[p].u == config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
        }
    }
}
// 创建axios实例
const service = axios.create({
  baseURL: staticHost2ApiHost(), // api 的 base_url
  // timeout: 5000, // 请求超时时间
  // headers: {
  //   'Content-Type': 'application/json',
  //   'X-Requested-With': 'XMLHttpRequest',
  // },
  params: {}
})
// request拦截器
service.interceptors.request.use(
  config => {
    Toast.loading('', 0)
    removePending(config); //在一个ajax发送前执行一下取消操作
    config.cancelToken = new cancelToken((c)=>{
        // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        pending.push({ u: config.url + '&' + config.method, f: c });  
    });
    // Object.assign(config.params,{requestId:new Date().getTime()+''+parseInt(Math.random*1000),appType:20})
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    let res = response.data;
    Toast.hide()
    console.log(res)
    removePending(response.config);  //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    if (res.code != 0) {
      Toast.info(JSON.stringify(res),1)
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    Toast.hide()
    Toast.info(error.message,1)
    return Promise.reject(error)
  }
)

export default service
