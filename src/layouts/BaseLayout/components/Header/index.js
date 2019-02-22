import React from 'react';
import Layout from '@icedesign/layout';
import Menu from '@icedesign/menu';
import { Icon, Balloon } from '@alifd/next';
import { Link, withRouter } from 'react-router-dom';
import { asideMenuConfig } from '../../../../menuConfig';
import Logo from '../Logo';
import './index.scss';

@withRouter
class Header extends React.Component {
    getSelectKeys() {
        const selectKeys = this.props.location.pathname.split('/').filter((i) => i);
        if (selectKeys.length === 0) {
            selectKeys.push('home');
        }
        return selectKeys;
    }

    renderUser = () => {
        const { profile } = this.props;
        const trigger = (
            <div className="ice-header-userpannel">
                <img
                    src="https://img.alicdn.com/tfs/TB1FJSxwMHqK1RjSZFgXXa7JXXa-80-80.png"
                    alt=""
                    className="ice-header-user-avatar"
                />
                <span className="ice-header-user-name">
                    {profile.name || 'ioa'}
                    <Icon className="ice-header-arrow" size="xs" type="arrow-down" />
                </span>
            </div>
        );

        return (
            <Balloon
                triggerType="click"
                trigger={trigger}
                align="br"
                alignEdge
                closable={false}
                className="ice-header-balloon"
                style={{ width: '80px' }}
            >
                <div className="ice-header-personal-menu">
                    <a onClick={() => {
                        this.props.handleLogout();
                    }}
                    >
                    退出
                    </a>
                </div>
            </Balloon>
        );
    };

    renderHeader() {
        const selectedKeys = this.getSelectKeys();

        return (
            <div className="ice-admin-layout-header">
                <Logo />
                {asideMenuConfig && asideMenuConfig.length > 0 ? (
                    <Menu mode="horizontal" selectedKeys={selectedKeys}>
                        {asideMenuConfig.map((nav) => {
                            return (
                                <Menu.Item key={nav.path.replace(/\//g, '') || 'home'}>
                                    <Link to={nav.path}>{nav.name}</Link>
                                </Menu.Item>
                            );
                        })}
                    </Menu>
                ) : null}
                {this.renderUser()}
            </div>
        );
    }

    render() {
        return <Layout.Header>{this.renderHeader()}</Layout.Header>;
    }
}

export default Header;
