/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Input, Button, Checkbox, Grid, Message, Icon } from '@alifd/next';
import {
    FormBinderWrapper as IceFormBinderWrapper,
    FormBinder as IceFormBinder,
    FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/icon';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import request from '../../util/request';

const { Row, Col } = Grid;

@inject('stores')
@observer
@withRouter
class UserLogin extends Component {
    static displayName = 'UserLogin';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            value: {
                username: '',
                password: '',
                checkbox: false,
            },
            serverAddress: '',
        };
    }

    @computed
    get userStore() {
        return this.props.stores.userStore;
    }

    formChange = (value) => {
        this.setState({
            value,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.refs.form.validateAll(async (errors, values) => {
            if (errors) {
                console.log('errors', errors);
                return;
            }

            this.userStore.setServerAddress(this.state.serverAddress);
            await this.userStore.userLogin(values);
            this.props.history.push('/');
        });
    };

    render() {
        return (
            <div style={styles.container}>
                <h4 style={styles.title}>登 录</h4>
                <IceFormBinderWrapper
                    value={this.state.value}
                    onChange={this.formChange}
                    ref="form"
                >
                    <div style={styles.formItems}>
                        <div style={styles.formItem}>
                            <Icon type="warning" size="small" style={styles.inputIcon} />
                            <Input
                                size="large"
                                maxLength={100}
                                placeholder="服务器地址"
                                style={styles.inputCol}
                                onChange={val => this.setState({ serverAddress: val })}
                            />
                        </div>
                        <div style={styles.formItem}>
                            <Icon type="account" size="small" style={styles.inputIcon} />
                            <IceFormBinder name="username" required message="必填">
                                <Input
                                    size="large"
                                    maxLength={20}
                                    placeholder="用户名"
                                    style={styles.inputCol}
                                />
                            </IceFormBinder>
                            <IceFormError name="username" />
                        </div>

                        <div style={styles.formItem}>
                            <IceIcon type="lock" size="small" style={styles.inputIcon} />
                            <IceFormBinder name="password" required message="必填">
                                <Input
                                    size="large"
                                    htmlType="password"
                                    placeholder="密码"
                                    style={styles.inputCol}
                                />
                            </IceFormBinder>
                            <IceFormError name="password" />
                        </div>

                        <div style={styles.formItem}>
                            <IceFormBinder name="checkbox">
                                <Checkbox style={styles.checkbox}>记住账号</Checkbox>
                            </IceFormBinder>
                        </div>

                        <div style={styles.footer}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={this.handleSubmit}
                                style={styles.submitBtn}
                                disabled={!this.state.serverAddress}
                            >
                                登 录
                            </Button>
                            <Link to="/user/register" style={styles.tips}>
                                立即注册
                            </Link>
                        </div>
                    </div>
                </IceFormBinderWrapper>
            </div>
        );
    }
}

const styles = {
    container: {
        width: '400px',
        padding: '40px',
        background: '#fff',
        borderRadius: '6px',
    },
    title: {
        margin: '0 0 40px',
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: '28px',
        fontWeight: '500',
        textAlign: 'center',
    },
    formItem: {
        position: 'relative',
        marginBottom: '20px',
    },
    inputIcon: {
        position: 'absolute',
        left: '10px',
        top: '8px',
        color: '#666',
    },
    inputCol: {
        width: '100%',
        paddingLeft: '20px',
    },
    submitBtn: {
        width: '100%',
    },
    tips: {
        marginTop: '20px',
        display: 'block',
        textAlign: 'center',
    },
};

export default UserLogin;
