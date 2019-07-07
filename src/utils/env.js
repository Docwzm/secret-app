export function staticHost2ApiHost() {
    var mHost = window.location.hostname
    return {
        'localhost': 'http://meinvbingyue.vipgz1.idcfengye.com',
    }[mHost] || 'http://meinvbingyue.vipgz1.idcfengye.com'
}