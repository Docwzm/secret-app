import layout from '../view/secret/components/layout'
import writeSecret from '../view/secret/write'
import checkSecret from '../view/secret/check'
import helpCenter from '../view/secret/helpCenter'
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
            }
        ]
    }
]

export default routes
