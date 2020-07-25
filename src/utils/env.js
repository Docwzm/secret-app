export function staticHost2ApiHost() {
    var mHost = window.location.hostname
    return {
        'localhost': 'https://symy.powerionics.cn',
        'symy.powerionics.cn': 'https://symy.powerionics.cn',
        'www.powerionics.vip': 'https://www.powerionics.vip',
    }[mHost] || 'https://www.powerionics.vip'
}