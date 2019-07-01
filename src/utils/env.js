export function staticHost2ApiHost() {
    var mHost = window.location.hostname
    return {
        'localhost': 'http://shequgouvip.com:18003',
    }[mHost] || ''
}