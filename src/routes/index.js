import layout from '../view/secret/components/layout'
import powerionicsLayout from '../view/secret/components/powerionicsLayout'
import writeSecret from '../view/secret/write'
import checkSecret from '../view/secret/check'
import helpCenter from '../view/secret/helpCenter'
const routes = [
    {
        path: '/',
        component: layout,
        exact:true
    },
    {
        path: '/helpCenter',
        component: helpCenter,
    },
    {
        path: '/powerionics',
        component: powerionicsLayout,
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
