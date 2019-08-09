import layout from '../view/secret/components/layout'
import writeSecret from '../view/secret/write'
import checkSecret from '../view/secret/check'
import checkSecretDetail from '../view/secret/check_detail'
import helpCenter from '../view/secret/helpCenter'
import success from '../view/secret/success'
import record from '../view/secret/record'
const routes = [
    {
        path: '/',
        redirect: '/powerionics/write',
        exact:true
    },
    {
        path: '/helpCenter',
        component: helpCenter,//帮助中心
    },
    {
        path: '/success',
        component: success,//提交结果（成功）
    },
    {
        path: '/powerionics',//统一封装处理微信跳转root页面
        component: layout,
        routes: [
            {
                path: '/powerionics/write',//表单提交
                component: writeSecret
            },
            {
                path: '/powerionics/record',//重新录音
                component: record
            },
            {
                path: '/powerionics/check',//查看表单
                component: checkSecret
            },
            {
                path: '/powerionics/checkDetail',//表单详情
                component: checkSecretDetail
            }
        ]
    }
]

export default routes
