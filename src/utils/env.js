export function staticHost2ApiHost() {
    var mHost = window.location.hostname
    return {
        'localhost': 'https://powerionics.vip',
    }[mHost] || 'https://powerionics.vip'
}