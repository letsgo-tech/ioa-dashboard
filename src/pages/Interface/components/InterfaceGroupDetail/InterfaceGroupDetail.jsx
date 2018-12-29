import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Dialog, Select } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import { inject, observer } from 'mobx-react';
import './InterfaceGroupDetail.scss';

const methods = [
    { label: 'GET', value: 'get' },
    { label: 'POST', value: 'post' },
    { label: 'PUT', value: 'put' },
    { label: 'DELETE', value: 'delete' },
    { label: 'PATCH', value: 'patch' },
    { label: 'OPTION', value: 'option' },
    { label: 'HEAD', value: 'head' },
    { label: 'CONNECT', value: 'connect' },
];

@inject('stores')
@observer
export default class InterfaceGroupDetail extends Component {
    static displayName = 'InterfaceGroupDetail';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isCreating: false,
            value: {
                apiGroupId: '',
                name: '',
                method: 'get',
                path: '',
            },
        };
    }

    componentDidMount() {
        const groupId = this.props.match.params.id;
        this.fetchApiGroup(groupId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            const groupId = nextProps.match.params.id;
            this.fetchApiGroup(groupId);
        }
    }

    async fetchApiGroup(id) {
        try {
            await this.props.stores.apiStore.fetchApiGroup(id);
        } catch (e) {
            Feedback.toast.error(e || '获取分组失败');
        }
    }

    validateFields = () => {
        const { validateFields } = this.refs.form;
        const { apiStore } = this.props.stores;

        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    this.setState({ isCreating: true });
                    await apiStore.createApi(Object.assign({}, values, { apiGroupId: apiStore.currentGroup.id }));
                    this.setState({ isCreating: false, visible: false });
                    Feedback.toast.success('添加接口成功');
                    this.setState({ value: { apiGroupId: '', name: '', method: 'get', path: '' } });
                } catch (error) {
                    this.setState({ isCreating: false });
                    Feedback.toast.error('添加接口失败， 请稍后重试');
                }
            }
        });
    }

    renderOverlay = () => {
        const { currentGroup } = this.props.stores.apiStore;
        return (
            <Overlay
                visible={this.state.visible}
                hasMask
                disableScroll
                align="cc cc"
                canCloseByOutSideClick={false}
                safeNode={() => this.refs.from}
                onRequestClose={() => this.setState({ visible: false })}
            >
                <Loading shape="flower" tip="creating..." color="#666" visible={this.state.isCreating}>
                    <div style={styles.formContainer}>
                        <h4 style={{ paddingTop: '10px' }}>添加接口</h4>
                        <FormBinderWrapper
                            value={this.state.value}
                            onChange={value => this.setState({ value })}
                            ref="form"
                        >
                            <div style={styles.formItems}>
                                <div style={styles.formItem}>
                                    <span style={styles.formItemLabel}>组别：</span>
                                    <Input value={currentGroup.name} disabled style={{ flex: 1 }} />
                                </div>

                                <div>
                                    <div style={styles.formItem}>
                                        <span style={styles.formItemLabel}>名称：</span>
                                        <FormBinder name="name" required message="请输入接口名称">
                                            <Input
                                                size="large"
                                                placeholder="接口名称"
                                            />
                                        </FormBinder>
                                    </div>
                                    <FormError name="name" />
                                </div>

                                <div style={styles.formItemWrapper}>
                                    <div style={styles.formItem}>
                                        <span style={styles.formItemLabel}>路径：</span>
                                        <div style={{ display: 'flex' }}>
                                            <FormBinder name="method" required message="请求方法">
                                                <Select
                                                    style={{ height: '32px', lineHeight: '32px' }}
                                                    dataSource={methods}
                                                    placeholder="方法"
                                                />
                                            </FormBinder>
                                            <FormBinder name="path" required message="请输入接口路径">
                                                <Input
                                                    size="large"
                                                    placeholder="/path"
                                                />
                                            </FormBinder>
                                        </div>
                                    </div>
                                    <FormError name="path" />
                                </div>
                            </div>

                            <div style={{ textAlign: 'end', padding: '10px 0' }}>
                                <Button type="normal" onClick={() => this.setState({ visible: false })} style={{ marginRight: '10px' }}>
                                    取 消
                                </Button>
                                <Button type="primary" onClick={() => this.validateFields()} disabled={!(this.state.value.name && this.state.value.path)}>
                                    提 交
                                </Button>
                            </div>
                        </FormBinderWrapper>
                    </div>
                </Loading>
            </Overlay>
        );
    }

    render() {
        const { currentGroup } = this.props.stores.apiStore;
        return (
            <div>
                <div style={styles.header}>
                    <h2>{ currentGroup.name } { currentGroup.api ? `共(${currentGroup.api.length})个` : '' }</h2>
                    <Button type="primary" onClick={() => this.setState({ visible: true })}>添加接口</Button>
                    { this.renderOverlay() }
                </div>
            </div>
        );
    }
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '0 20px',
    },
    formItem: {
        alignItems: 'center',
        display: 'flex',
        padding: '10px 0',
    },
};
