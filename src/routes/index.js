import layout from '../view/secret/components/layout'
import writeSecret from '../view/secret/write'
import checkSecret from '../view/secret/check'
import checkSecretDetail from '../view/secret/check_detail'
import helpCenter from '../view/secret/helpCenter'
import success from '../view/secret/success'
const routes = [
    {
        path: '/',
        redirect: '/powerionics/write',
        exact:true
    },
    {
        path: '/helpCenter',
        component: helpCenter,
    },
    {
        path: '/success',
        component: success,
    },
    {
        path: '/powerionics',
        component: layout,
        routes: [
            {
                path: '/powerionics/write',
                component: writeSecret
            },
            {
                path: '/powerionics/check',
                component: checkSecret
            },
            {
                path: '/powerionics/checkDetail',
                component: checkSecretDetail
            }
        ]
    }
]

export default routes
