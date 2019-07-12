export function staticHost2ApiHost() {
    var mHost = window.location.hostname
    return {
        'localhost': 'https://symy.powerionics.cn',
    }[mHost] || 'https://symy.powerionics.cn'
}