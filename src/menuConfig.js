// 菜单配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
    {
        text: '反馈',
        to: '//github.com/alibaba/ice/issues/new',
        external: true,
        newWindow: true,
        icon: 'cart',
    },
    {
        text: '帮助',
        to: '//alibaba.github.io/ice/',
        external: true,
        newWindow: true,
        icon: 'all',
    },
];

const asideMenuConfig = [
    {
        name: '\u63A5\u53E3',
        path: '/api',
        icon: 'home',
    },
];

export { headerMenuConfig, asideMenuConfig };
