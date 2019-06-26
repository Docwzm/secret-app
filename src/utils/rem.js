;(function(doc, win) {
    var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function() {
        var clientWidth = docEl.clientWidth
        if (!clientWidth) return
        if(clientWidth>800){
          clientWidth = 800
        }
        var rem = clientWidth / 375 * 16
        docEl.style.fontSize = rem + 'px'
      }
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
  })(document, window)