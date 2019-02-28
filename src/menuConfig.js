// 菜单配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
    {
        text: '反馈',
        to: 'https://www.kuipmake.com/#/',
        external: true,
        newWindow: true,
        icon: 'cart',
    },
    {
        text: '帮助',
        to: 'https://www.kuipmake.com/#/',
        external: true,
        newWindow: true,
        icon: 'all',
    },
];

const asideMenuConfig = [
    {
        name: 'Interface',
        path: '/interface',
        icon: 'home',
    },
    {
        name: 'Policy',
        path: '/policy',
        icon: 'home',
    },
    {
        name: 'Plugin',
        path: '/plugin',
        icon: 'home',
    },
];

export { headerMenuConfig, asideMenuConfig };
