import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Api from './pages/Api';
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
        path: '/api',
        layout: BaseLayout,
        component: Api,
    },
];

export default routerConfig;
