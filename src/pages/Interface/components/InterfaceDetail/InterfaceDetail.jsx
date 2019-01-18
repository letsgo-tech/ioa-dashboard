import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Dialog, Grid, Tag, Select, Table } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import ParamList from './component/ParamList';
import TargetList from './component/TargetList';
import ApiPluginList from './component/ApiPluginList';
import './InterfaceDetail.scss';

const { Row, Col } = Grid;
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
export default class InterfaceDetail extends Component {
    static displayName = 'InterfaceDetail';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isLoading: false,
            name: '',
            method: '',
            path: '',
        };
    }

    @computed
    get apiStore() {
        return this.props.stores.apiStore;
    }

    async componentDidMount() {
        const apiId = this.props.match.params.id;
        this.fetchApi(apiId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            const apiId = nextProps.match.params.id;
            this.fetchApi(apiId);
        }
    }

    async fetchApi(id) {
        try {
            await this.apiStore.fetchApi(id);
            const { apiGroupId } = this.apiStore.currentApi;
            //await this.apiStore.fetchApiGroup(apiGroupId);
        } catch (e) {
            Feedback.toast.error(e.message || '获取接口详情失败');
        }
    }

    async updateApi() {
        const { currentApi } = this.apiStore;
        const { name, method, path } = this.state;
        if (!name) {
            alert('名称不能为空');
            return;
        }
        try {
            this.setState({ isLoading: true });
            await this.apiStore.patchApi(currentApi.id, { name, method, path });
            this.setState({ isLoading: false, isEdit: false });
        } catch (e) {
            this.setState({ isLoading: false });
            Feedback.toast.error(e.message || '更新接口失败， 请稍后重试');
        }
    }

    onEdit() {
        const { name, method, path } = this.apiStore.currentApi;
        this.setState({ isEdit: true, name, method, path });
    }

    onDelete() {
        const { id, name } = this.apiStore.currentApi;
        Dialog.confirm({
            content: `是否删除${name}`,
            title: '删除接口',
            onOk: async () => {
                try {
                    await this.props.stores.apiStore.deleteApiById(id);
                    Feedback.toast.success('删除接口成功');
                    this.props.history.replace('/');
                } catch (e) {
                    Feedback.toast.error('删除接口失败');
                }
            },
        });
    }

    render() {
        const { currentApi } = this.apiStore;
        return (
            <div>
                <h2 style={styles.basicDetailTitle}>接口详情 ({currentApi.name})</h2>

                <div style={styles.infoColumn}>
                    <div style={styles.secTitle}>
                        <h5 style={styles.infoColumnTitle}>基本信息</h5>
                        {
                            this.state.isEdit ?
                                <div>
                                    <Button size="small" onClick={() => this.setState({ isEdit: false })}>取消</Button>
                                    <Button size="small" type="primary" loading={this.state.isLoading} onClick={() => this.updateApi()}>提交</Button>
                                </div> :
                                <div>
                                    <Button size="small" type="secondary" onClick={() => this.onDelete()} style={{ marginRight: '6px' }}>删除</Button>
                                    <Button size="small" type="primary" onClick={() => this.onEdit()}>编辑</Button>
                                </div>
                        }
                    </div>
                    <Row wrap style={styles.infoItems}>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>接口名称：</span>
                            {
                                this.state.isEdit ?
                                    <Input value={this.state.name} onChange={name => this.setState({ name })} placeholder="name" /> :
                                    <span style={styles.infoItemValue}>{currentApi.name}</span>
                            }
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>请求方法：</span>
                            <span style={styles.infoItemValue}>
                                {
                                    this.state.isEdit ?
                                        <Select
                                            style={{ width: '120px' }}
                                            dataSource={methods}
                                            value={this.state.method}
                                            onChange={method => this.setState({ method })}
                                        /> :
                                        <Tag shape="readonly" size="medium" className={`${currentApi.method}-tag`} style={{ color: '#666' }}>{ currentApi.method }</Tag>
                                }
                            </span>
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>接口路径：</span>
                            {
                                this.state.isEdit ?
                                    <Input value={this.state.path} onChange={path => this.setState({ path })} placeholder="/{path}" /> :
                                    <span style={styles.infoItemValue}>{currentApi.path}</span>
                            }
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>更新时间：</span>
                            <span style={styles.infoItemValue}>{new Date(currentApi.updatedAt).toLocaleString()}</span>
                        </Col>
                    </Row>
                </div>
                <ParamList />
                <TargetList />
                <ApiPluginList />
            </div>
        );
    }
}

const styles = {
    secTitle: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    basicDetailTitle: {
        margin: '10px 0',
        fontSize: '16px',
    },
    infoColumn: {
        marginLeft: '16px',
    },
    infoColumnTitle: {
        margin: '20px 0',
        paddingLeft: '10px',
        borderLeft: '3px solid #3080fe',
    },
    infoItems: {
        padding: 0,
        marginLeft: '25px',
    },
    infoItem: {
        alignItems: 'center',
        display: 'flex',
        marginBottom: '18px',
        listStyle: 'none',
        fontSize: '14px',
    },
    infoItemLabel: {
        minWidth: '70px',
        color: '#999',
    },
    infoItemValue: {
        color: '#333',
    },
    attachLabel: {
        minWidth: '70px',
        color: '#999',
        float: 'left',
    },
    attachPics: {
        width: '80px',
        height: '80px',
        border: '1px solid #eee',
        marginRight: '10px',
    },
};
