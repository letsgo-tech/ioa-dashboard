import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Interface from './pages/Interface';
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
];

export default routerConfig;
