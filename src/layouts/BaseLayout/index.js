import React, { Component } from 'react';
import Layout from '@icedesign/layout';
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';

import Header from './components/Header';
import MainRoutes from './MainRoutes';

@inject('stores')
@observer
@withRouter
export default class CustomLayout extends Component {
    componentDidMount() {
        const history = this.props.history;
        if (!this.props.stores.userStore.token) {
            history.replace('/user/login');
        }
    }

    render() {
        const { profile = {}, userLogout } = this.props.stores.userStore;

        return (
            <Layout style={styles.container}>
                <Header
                    profile={profile}
                    handleLogout={async () => {
                        await userLogout();
                        history.replace('/user/login');
                    }}
                />

                <Layout.Section className="ice-admin-layout-body">
                    <Layout.Main>
                        <MainRoutes />
                    </Layout.Main>
                </Layout.Section>
            </Layout>
        );
    }
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f2f2f2',
        minWidth: '980px',
    },
};
