import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Interface from './pages/Interface';
import Plugin from './pages/Plugin';
import Policy from './pages/Policy';
import BaseLayout from './layouts/BaseLayout';

const routerConfig = [
    {
        path: '/user/login',
        component: UserLogin,
    },
    {
        path: '/user/register',
        component: UserRegister,
    },
    {
        path: '/interface',
        layout: BaseLayout,
        component: Interface,
    },
    {
        path: '/policy',
        layout: BaseLayout,
        component: Policy,
    },
    {
        path: '/plugin',
        layout: BaseLayout,
        component: Plugin,
    },
];

export default routerConfig;
