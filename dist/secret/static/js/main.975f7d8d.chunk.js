(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{114:function(e,t,a){e.exports=a.p+"static/media/bg.b1a2b9fa.jpg"},123:function(e,t,a){e.exports=a(272)},128:function(e,t,a){},129:function(e,t,a){},270:function(e,t){!function(e,t){var a=e.documentElement,n="orientationchange"in window?"orientationchange":"resize",r=function(){var e=a.clientWidth;if(e){e>800&&(e=800);var t=e/375*16;a.style.fontSize=t+"px"}};e.addEventListener&&(t.addEventListener(n,r,!1),e.addEventListener("DOMContentLoaded",r,!1))}(document,window)},271:function(e,t,a){},272:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(17),i=a.n(o),c=a(81),s=a(23),l=a(21),u=a(22),m=a(35),d=a(34),p=a(36),f=function(e,t){var a=new RegExp("(^|&)"+t+"=([^&]*)(&|$)","i");if(e.indexOf("?")>=0){var n=e.split("?")[1].match(a);return null!=n?n[2]:null}return null},h=function(e,t){return window.localStorage.setItem(e,t)},g=function(e){return window.localStorage.removeItem(e)},v=a(114),w=a.n(v),b=(a(128),a(129),function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(m.a)(this,Object(d.a)(t).call(this))).state={bgUrl:""},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentWillMount",value:function(){f(this.props.history.location.search,"bg")?this.setState({bgUrl:w.a}):this.getBgUrl(),this.getAuth()}},{key:"getAuth",value:function(){}},{key:"getBgUrl",value:function(){this.setState({bgUrl:""})}},{key:"render",value:function(){var e={backgroundImage:"url(".concat(this.state.bgUrl,")")};return r.a.createElement("div",{id:"secret-wrap",style:e},this.props.routes.map(function(e,t){return r.a.createElement(s.a,{key:t,exact:e.exact,path:e.path,render:function(t){return r.a.createElement(e.component,Object.assign({},t,{routes:e.routes}))}})}))}}]),t}(r.a.Component)),E=(a(86),a(38)),k=a.n(E),y=(a(184),a(116)),S=a.n(y),I=(a(191),a(117)),C=a.n(I),x=(a(58),a(27)),N=a.n(x),U=(a(98),a(39)),A=a.n(U),j=a(122),O=(a(73),a(15)),F=a.n(O),_=a(54),M=a(121),R=a.n(M),W=function(){function e(t,a){var n=this;Object(l.a)(this,e),this.config={bufferLen:4096,numChannels:2,mimeType:"audio/wav"},this.recording=!1,this.callbacks={getBuffer:[],exportWAV:[]},Object.assign(this.config,a),this.context=t.context,this.node=(this.context.createScriptProcessor||this.context.createJavaScriptNode).call(this.context,this.config.bufferLen,this.config.numChannels,this.config.numChannels),this.node.onaudioprocess=function(e){if(n.recording){for(var t=[],a=0;a<n.config.numChannels;a++)t.push(e.inputBuffer.getChannelData(a));n.worker.postMessage({command:"record",buffer:t})}},t.connect(this.node),this.node.connect(this.context.destination);this.worker=new R.a(function(){var e,t,a=0,n=[];function r(){for(var e=0;e<t;e++)n[e]=[]}function o(e,t){for(var a=new Float32Array(t),n=0,r=0;r<e.length;r++)a.set(e[r],n),n+=e[r].length;return a}function i(e,t,a){for(var n=0;n<a.length;n++)e.setUint8(t+n,a.charCodeAt(n))}this.onmessage=function(c){switch(c.data.command){case"init":s=c.data.config,e=s.sampleRate,t=s.numChannels,r();break;case"record":!function(e){for(var r=0;r<t;r++)n[r].push(e[r]);a+=e[0].length}(c.data.buffer);break;case"exportWAV":!function(r){for(var c,s=[],l=0;l<t;l++)s.push(o(n[l],a));c=2===t?function(e,t){var a=e.length+t.length,n=new Float32Array(a),r=0,o=0;for(;r<a;)n[r++]=e[o],n[r++]=t[o],o++;return n}(s[0],s[1]):s[0];var u=function(a){var n=new ArrayBuffer(44+2*a.length),r=new DataView(n);return i(r,0,"RIFF"),r.setUint32(4,36+2*a.length,!0),i(r,8,"WAVE"),i(r,12,"fmt "),r.setUint32(16,16,!0),r.setUint16(20,1,!0),r.setUint16(22,t,!0),r.setUint32(24,e,!0),r.setUint32(28,4*e,!0),r.setUint16(32,2*t,!0),r.setUint16(34,16,!0),i(r,36,"data"),r.setUint32(40,2*a.length,!0),function(e,t,a){for(var n=0;n<a.length;n++,t+=2){var r=Math.max(-1,Math.min(1,a[n]));e.setInt16(t,r<0?32768*r:32767*r,!0)}}(r,44,a),r}(c),m=new Blob([u],{type:r});this.postMessage({command:"exportWAV",data:m})}(c.data.type);break;case"getBuffer":!function(){for(var e=[],r=0;r<t;r++)e.push(o(n[r],a));this.postMessage({command:"getBuffer",data:e})}();break;case"clear":a=0,n=[],r()}var s}},{}),this.worker.postMessage({command:"init",config:{sampleRate:this.context.sampleRate,numChannels:this.config.numChannels}}),this.worker.onmessage=function(e){var t=n.callbacks[e.data.command].pop();"function"==typeof t&&t(e.data.data)}}return Object(u.a)(e,[{key:"record",value:function(){this.recording=!0}},{key:"stop",value:function(){this.recording=!1}},{key:"clear",value:function(){this.worker.postMessage({command:"clear"})}},{key:"getBuffer",value:function(e){if(!(e=e||this.config.callback))throw new Error("Callback not set");this.callbacks.getBuffer.push(e),this.worker.postMessage({command:"getBuffer"})}},{key:"exportWAV",value:function(e,t){if(t=t||this.config.mimeType,!(e=e||this.config.callback))throw new Error("Callback not set");this.callbacks.exportWAV.push(e),this.worker.postMessage({command:"exportWAV",type:t})}}],[{key:"forceDownload",value:function(e,t){var a=(window.URL||window.webkitURL).createObjectURL(e),n=window.document.createElement("a");n.href=a,n.download=t||"output.wav";var r=document.createEvent("Event");r.initEvent("click",!0,!0),n.dispatchEvent(r)}}]),e}(),L=a(84),T=a.n(L);var B=[],V=T.a.CancelToken,D=function(e){for(var t in B)B[t].u==e.url+"&"+e.method&&(B[t].f(),B.splice(t,1))},q=T.a.create({baseURL:{localhost:"http://shequgouvip.com:18003"}[window.location.hostname]||"http://shequgouvip.com:18003",params:{}});q.interceptors.request.use(function(e){return F.a.loading("",0),D(e),e.cancelToken=new V(function(t){B.push({u:e.url+"&"+e.method,f:t})}),e},function(e){Promise.reject(e)}),q.interceptors.response.use(function(e){var t=e.data;return F.a.hide(),D(e.config),0!=t.code?(F.a.info(t.data,1),Promise.reject(t)):e.data},function(e){return F.a.hide(),F.a.info(e.message,1),Promise.reject(e)});var P=q,H=function(e){return P({url:"/api/speech/info-mobile",method:"get",params:{mobile:e}})},J=function(e){return P({url:"/api/speech",method:"post",data:e})},z=function(e){return P({url:"/static/ueditor/1.4.3.3/php/controller.php?action=uploadvideo",method:"post",headers:{"Content-Type":"multipart/form-data"},data:e})},$=function(e){return P({url:"/static/ueditor/1.4.3.3/php/controller.php?action=uploadimage",method:"post",headers:{"Content-Type":"multipart/form-data"},data:e})},G=a(53),K=a.n(G),Q=function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(m.a)(this,Object(d.a)(t).call(this))).record=function(){var t=e.state,a=t.audioStatus,n=t.recorder;clearTimeout(e.timer);var r=function(){var t=e.state,a=t.audioStatus,n=t.recorder;0==a||2==a?(e.setState({audioStatus:1}),n.record(),clearTimeout(e.timer),e.timer=setTimeout(function(){e.stopRecording()},3e4)):1==a&&e.stopRecording()};if(0!=a||n)r();else{var o=null;try{window.AudioContext=window.AudioContext||window.webkitAudioContext,navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia,window.URL=window.URL||window.webkitURL,o=new AudioContext,navigator.mediaDevices.getUserMedia({audio:!0}).then(function(t){g("_secret_"),e.startUserMedia(o,t,r)}).catch(function(t){h("_secret_",JSON.stringify(e.props.form.getFieldsValue())),window.location.reload()})}catch(i){F.a.info("\u8be5\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u5f55\u97f3,\u8bf7\u7528\u5176\u4ed6\u6d4f\u89c8\u5668\u6253\u5f00")}}},e.validateIdp=function(e,t,a){1==t?a(new Error("Invalid Date")):a()},e.previewImg=function(t){e.setState({previewFlag:!0,previewImgArr:[t[0].url],previewImgIndex:0})},e.previewClose=function(){e.setState({previewFlag:!1})},e.onChange=function(t,a,n){if(0!=t.length){var r=t[0].file,o=new FormData;o.append("upfile",r),$(o).then(function(a){e.setState({files:t,imgFileId:a.id})})}else e.setState({files:t,imgFileId:null})},e.onSubmit=function(){e.props.form.validateFields({force:!0},function(t,a){if(t)for(var n in t){var r=t[n];return void F.a.info(r.errors[0].message)}else if(e.state.imgFileId&&(a.thumb=e.state.imgFileId),a.mobile=a.mobile.replace(/\s*/g,""),e.state.audioBlod){var o=new FormData;o.append("upfile",e.state.audioBlod,"test.wav"),z(o).then(function(t){a.audio=t.id,J(a).then(function(t){e.props.history.push("/secret/check?phone=".concat(a.mobile))})})}else J(a).then(function(t){e.props.history.push("/secret/check?phone=".concat(a.mobile))})})},e.state={disabled:!0,files:[],imgFileId:null,recorder:null,audioStatus:0,previewFlag:!1,previewImgArr:[],previewImgIndex:0},e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentWillMount",value:function(){var e,t=(e="_secret_",window.localStorage.getItem(e));t&&(t=JSON.parse(t),this.setState(Object(j.a)({},t)),g("_secret_")),clearTimeout(this.timer)}},{key:"componentWillUnmount",value:function(){clearTimeout(this.timer)}},{key:"startUserMedia",value:function(e,t,a){var n=e.createMediaStreamSource(t);this.setState({recorder:new W(n)},function(){a&&a()})}},{key:"stopRecording",value:function(){var e=this,t=this.state.recorder;t.stop(),t.exportWAV(function(t){e.setState({audioBlod:t,audioUrl:URL.createObjectURL(t),audioStatus:2})}),t.clear()}},{key:"render",value:function(){var e=this,t=this.state,a=t.files,n=t.audioStatus,o=t.audioUrl,i=t.previewFlag,c=t.previewImgArr,s=t.previewImgIndex,l=this.props.form,u=l.getFieldProps;l.getFieldError;return r.a.createElement("div",null,i?r.a.createElement(K.a,{onClose:this.previewClose,urls:c,index:s}):null,r.a.createElement("form",{className:"secret-wirte-form"},r.a.createElement(N.a,{className:"no-bg",renderHeader:function(){return r.a.createElement("div",null,r.a.createElement("p",{className:"label"},"\u5f55\u5236\u8bed\u97f3\uff1a"),r.a.createElement("p",null,"\u965030\u79d2"))}},r.a.createElement("div",{className:"audio-wrap"},r.a.createElement(A.a,{size:"small",type:"primary",onClick:this.record},0==n?"\u5f00\u59cb":1==n?"\u7ed3\u675f":"\u91cd\u5f55"),o?r.a.createElement("audio",{controls:!0,src:o}):null)),r.a.createElement(N.a,{renderHeader:function(){return r.a.createElement("div",null,r.a.createElement("p",{className:"label"},"\u6211\u60f3\u5bf9\u60a8\u8bf4\uff1a"),r.a.createElement("p",null,"\u586b\u5199\u60a8\u60f3\u5bf9TA\u8bf4\u7684\u8bdd\uff0c\u4e0d\u9650\u5b57\u6570"))}},r.a.createElement(C.a,Object.assign({rows:"2"},u("say_to_you",{initialValue:this.state.say_to_you,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bf9TA\u8bf4\u7684\u8bdd"}]})))),r.a.createElement(N.a,{className:"no-bg bg-list",renderHeader:function(){return r.a.createElement("div",null,r.a.createElement("p",{className:"label"},"\u6c38\u6052\u4e00\u523b\uff1a"),r.a.createElement("p",null,"\u9009\u586b\u9879\uff01\u4e0a\u4f20\u60a8\u60f3\u5206\u4eab\u7684\u56fe\u7247\uff0c\u53ef\u9009\u62e9\u4e0a\u4f20\u6216\u4e0d\u4e0a\u4f20\uff01"))}},r.a.createElement(S.a,{files:a,onChange:this.onChange,onImageClick:function(t,a){return e.previewImg(a)},selectable:a.length<1,multiple:!1})),r.a.createElement(N.a,{renderHeader:function(){return r.a.createElement("div",null,r.a.createElement("p",{className:"label"},"\u9001\u5361\u4eba\u59d3\u540d/\u6635\u79f0\uff1a"),r.a.createElement("p",null,"\u9009\u586b\u9879\uff01\u5982\u679c\u60a8\u4e0d\u60f3\u8ba9\u5bf9\u65b9\u77e5\u9053\u662f\u8c01\uff0c\u53ef\u4e0d\u586b\uff01"))}},r.a.createElement(k.a,u("username",{initialValue:this.state.username}))),r.a.createElement(N.a,{renderHeader:function(){return r.a.createElement("div",null,r.a.createElement("p",{className:"label"},"powerionics\u6dd8\u5b9d\u6216\u4eac\u4e1c\u8ba2\u5355\u7f16\u53f7\uff1a"),r.a.createElement("p",null,"\u53ef\u5728\u60a8\u7684\u6dd8\u5b9d\u4eac\u4e1c\u8ba2\u5355\u5185\u67e5\u8be2\u590d\u5236\uff01"))}},r.a.createElement(k.a,u("order_code",{initialValue:this.state.order_code,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u8ba2\u5355\u7f16\u53f7"}]}))),r.a.createElement(N.a,{renderHeader:function(){return r.a.createElement("div",null,r.a.createElement("p",{className:"label"},"\u624b\u673a\u53f7\u7801\uff1a"),r.a.createElement("p",null,"\u5fc5\u586b\u9879\uff01\u8bf7\u586b\u5199\u6536\u5361\u4eba\u7684\u624b\u673a\u53f7\uff0c\u6b64\u624b\u673a\u53f7\u5373\u4e3a\u5bf9\u65b9\u67e5\u8be2\u7559\u8a00\u7684\u552f\u4e00\u5bc6\u7801\uff0c\u8bf7\u6838\u5bf9\u65e0\u8bef\uff01"))}},r.a.createElement(k.a,Object.assign({type:"phone",placeholder:"\u5bf9\u65b9\u624b\u673a\u53f7\u7801"},u("mobile",{initialValue:this.state.mobile,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bf9\u65b9\u624b\u673a\u53f7\u7801"}]})))),r.a.createElement(A.a,{className:"fixed-bottom-btn",type:"primary",onClick:this.onSubmit},"\u63d0\u4ea4")))}}]),t}(r.a.Component),X=Object(_.a)()(Q),Y=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(m.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(r)))).state={check_status:"off",audioUrl:"",audioStatus:0,secretInfo:{},previewFlag:!1,previewImgArr:[],previewImgIndex:0},a.onSubmit=function(){a.props.form.validateFields({force:!0},function(e,t){if(e)for(var n in e){var r=e[n];return void F.a.info(r.errors[0].message)}else t.phone=t.phone.toString().replace(/\s*/g,""),H(t.phone).then(function(e){a.setState({check_status:"on",secretInfo:e.data})})})},a.playAudio=function(){var e=document.getElementById("my_audio");e.volume=1;var t=a.state.audioStatus;0==t?(e.play(),a.setState({audioStatus:1})):1==t?(a.setState({audioStatus:2}),e.pause()):2==t?(e.play(),a.setState({audioStatus:1})):3==t&&(e.play(),a.setState({audioStatus:1}))},a.previewImg=function(){a.setState({previewFlag:!0,previewImgArr:[a.state.secretInfo.thumb],previewImgIndex:0})},a.previewClose=function(){a.setState({previewFlag:!1})},a}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentWillMount",value:function(){var e=f(this.props.history.location.search,"phone");e&&this.getInfo(e)}},{key:"getInfo",value:function(e){var t=this;H(e).then(function(e){t.setState({check_status:"on",secretInfo:e.data})})}},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.state,t=e.check_status,a=e.audioStatus,n=e.secretInfo,o=e.previewFlag,i=e.previewImgArr,c=e.previewImgIndex,s=n.created_at,l=n.audio,u=n.say_to_you,m=n.thumb,d=n.username,p=this.props.form.getFieldProps;return r.a.createElement("div",{className:"secret-check-wrap"},o?r.a.createElement(K.a,{onClose:this.previewClose,urls:i,index:c}):null,"off"===t?r.a.createElement("div",{className:"secret-check-form-wrap"},r.a.createElement("div",{className:"tip"},r.a.createElement("p",null,"\u60a8\u7684\u670b\u53cb\u968f\u793c\u7269\u8fd8\u7ed9\u60a8\u7559\u4e86\u4e00\u6bb5\u79c1\u8a00\u5bc6\u8bed\uff0c\u60a8\u7684\u624b\u673a\u53f7\u662f\u67e5\u8be2\u7559\u8a00\u7684\u5bc6\u7801\uff01"),r.a.createElement("p",null,"\u8bf7\u8f93\u5165\u60a8\u7684\u624b\u673a\u53f7\u7801\u67e5\u770bTA\u4e3a\u60a8\u7559\u4e0b\u7684\u79c1\u8a00\u5bc6\u8bed......")),r.a.createElement("form",{className:"secret-check-form"},r.a.createElement(k.a,Object.assign({type:"phone"},p("phone",{initialValue:this.state.phone,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u624b\u673a\u53f7\u7801"}]})),"\u624b\u673a\u53f7\u7801\uff1a"),r.a.createElement(A.a,{className:"search-btn",size:"small",type:"primary",onClick:this.onSubmit},"\u67e5\u8be2"))):r.a.createElement("div",{className:"result"},r.a.createElement("div",{className:"item"},r.a.createElement("p",{className:"label"},"\u8bed\u97f3\u6d88\u606f\uff1a"),r.a.createElement("p",{className:"content light"},r.a.createElement(A.a,{onClick:this.playAudio},0==a||2==a?"\u64ad\u653e":3==a?"\u91cd\u64ad":"\u6682\u505c"),r.a.createElement("audio",{id:"my_audio",src:l}))),r.a.createElement("div",{className:"item"},r.a.createElement("p",{className:"label"},"\u6211\u60f3\u5bf9\u60a8\u8bf4\uff1a"),r.a.createElement("p",{className:"content light"},u)),r.a.createElement("div",{className:"item"},r.a.createElement("p",{className:"label"},"\u6c38\u6052\u4e00\u523b\uff1a"),r.a.createElement("p",{className:"content"},r.a.createElement("img",{onClick:this.previewImg,src:m}))),r.a.createElement("div",{className:"item"},r.a.createElement("p",{className:"label"},"\u9001\u5361\u4eba\u59d3\u540d/\u6635\u79f0\uff1a"),r.a.createElement("p",{className:"content"},d)),r.a.createElement("div",{className:"item"},r.a.createElement("p",{className:"label"},"\u63d0\u4ea4\u65f6\u95f4\uff1a"),r.a.createElement("p",{className:"content"},s)),r.a.createElement("a",{className:"url-btn",href:"//www.baidu.com",target:"_blank"},"\u6211\u4e5f\u8981\u6311\u9009\u793c\u7269\u9001TA")))}}]),t}(r.a.Component),Z=[{path:"/secret",component:b,routes:[{path:"/secret/write",component:X},{path:"/secret/check",component:Object(_.a)()(Y)}]}],ee=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function te(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var a=e.installing;null!=a&&(a.onstatechange=function(){"installed"===a.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}a(270),a(271);i.a.render(r.a.createElement(c.a,null,Z.map(function(e,t){return r.a.createElement(s.a,{key:t,exact:e.exact,path:e.path,render:function(t){return r.a.createElement(e.component,Object.assign({},t,{routes:e.routes}))}})})),document.querySelector("#root")),function(e){if("serviceWorker"in navigator){if(new URL(".",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat(".","/service-worker.js");ee?(function(e,t){fetch(e).then(function(a){var n=a.headers.get("content-type");404===a.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):te(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")})):te(t,e)})}}()}},[[123,1,2]]]);
//# sourceMappingURL=main.975f7d8d.chunk.js.map