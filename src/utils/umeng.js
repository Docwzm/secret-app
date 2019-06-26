//2017-5-7
//友盟统计，根据域名区分统计账号。
var _umId = { 'dev': 1261954418, 'qa': 1260948329, 'qa2': 1265329834, 'online': 1260952126 };
var _host = location.hostname;
var _hostType = 'dev'
if (_host.indexOf('cdn') != -1) {
  _hostType = 'online'
} else if (_host.indexOf('qa2') != -1) {
  _hostType = 'qa2'
} else if (_host.indexOf('qa') != -1) {
  _hostType = 'qa'
}
var umIdByHost = _umId[_hostType];
var umScript = document.createElement('script');
umScript.src = 'https://s95.cnzz.com/z_stat.php?id=' + umIdByHost + '&web_id=' + umIdByHost;
umScript.setAttribute('language', 'JavaScript');
document.head.appendChild(umScript)
umScript.onload = function () {
  //声明_czc对象:
  var _czc = _czc || [];
  //绑定siteid，请用您的siteid替换下方"XXXXXXXX"部分
  _czc.push(["_setAccount", umIdByHost]);
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  if (isAndroid) {
    _czc.push(["_setCustomVar", "安卓用户", "是"]);
  }
  if (isiOS) {
    _czc.push(["_setCustomVar", "苹果用户", "是"]);
  }
  console.log("umemgScript onload")
  window.umTrigger = function(type, action = '点击', label = ''){
    console.log(type, action, label)
    try {
      _czc.push(["_trackEvent", type, action, label]);
    } catch (e) {
      console.log('数据统计异常: ' + type, e)
    }
  }
}
