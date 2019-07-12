export function staticHost2ApiHost() {
    var mHost = window.location.hostname
    return {
        'localhost': 'https://symy.powerionics.com',
    }[mHost] || 'https://symy.powerionics.com'
}