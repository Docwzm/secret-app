/**
 *
 * 获取系统语言
 * @export
 */
export function getLocaleFromBrowser() {
    // return 'en'//默认返回英文
    return navigator.language || navigator.userLanguage || 'zh';
}

/**
 *
 * 根据参数返回标准的语言标示
 * @export
 * @param {string} currentLocale
 */
export function getLang(currentLocale) {
    currentLocale = currentLocale.toLowerCase()
    let lang = null
    if (currentLocale.indexOf('en') > -1) {
        lang = 'en'
    } else {
        //默认中文
        lang = 'zh'
    }
    return lang
}