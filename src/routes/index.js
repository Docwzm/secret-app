import layout from '../view/secret/components/layout'
import writeSecret from '../view/secret/write'
import checkSecret from '../view/secret/check'

const routes = [
    {
        path: '/secret',
        component: layout,
        routes: [
            {
                path: '/secret/write',
                component: writeSecret
            },
            {
                path: '/secret/check',
                component: checkSecret
            }
        ]
    }
]

export default routes
