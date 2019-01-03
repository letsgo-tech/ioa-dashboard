import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Tag, Select, Table } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Link } from 'react-router-dom';
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

    @computed
    get apiStore() {
        return this.props.stores.apiStore;
    }

    @computed
    get groups() {
        return this.apiStore.apiGroups.map(item => {
            return { label: item.name, value: item.id };
        });
    }

    async fetchApiGroup(id) {
        try {
            await this.apiStore.fetchApiGroup(id);
        } catch (e) {
            Feedback.toast.error(e.message || '获取分组失败');
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
                } catch (e) {
                    this.setState({ isCreating: false });
                    Feedback.toast.error(e.message || '添加接口失败， 请稍后重试');
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
                    <div className="overlay-form-container">
                        <h4 style={{ paddingTop: '10px' }}>添加接口</h4>
                        <FormBinderWrapper
                            value={this.state.value}
                            onChange={value => this.setState({ value })}
                            ref="form"
                        >
                            <div>
                                <div className="form-item">
                                    <span style={styles.formItemLabel}>组别：</span>
                                    <Input value={currentGroup.name} disabled style={{ flex: 1 }} />
                                </div>

                                <div>
                                    <div className="form-item">
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

                                <div>
                                    <div className="form-item">
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

    nameCellRender = (val, index, record) => {
        const { name, id } = record;
        return (
            <Link
                key={index}
                to={`/interface/api/${id}`}
            > {name}
            </Link>
        );
    }

    methodCellRender = (val, index, record) => {
        const { method, path } = record;
        return (
            <div>
                <Tag shape="readonly" size="medium" className={`${method}-tag`} style={{ color: '#666' }}>{ method }</Tag>
                <span>  { path }</span>
            </div>
        );
    }

    groupRender = (val, index, record) => {
        const { id: apiId } = record;
        const { id: currentGroupId } = this.apiStore.currentGroup;
        return (
            <div>
                <Select
                    dataSource={this.groups}
                    defaultValue={currentGroupId}
                    onChange={async value => {
                        try {
                            this.apiStore.changeGroup(apiId, currentGroupId, value);
                        } catch (e) {
                            Feedback.toast.error(e || '操作失败');
                        }
                    }}
                />
            </div>
        );
    }

    render() {
        const { currentGroup } = this.props.stores.apiStore;
        return (
            <div>
                <div style={styles.header}>
                    <h2>组名：{ currentGroup.name }  { currentGroup.apis ? `接口数：${currentGroup.apis.length} 个` : '' }</h2>
                    <Button type="primary" onClick={() => this.setState({ visible: true })}>添加接口</Button>
                    { this.renderOverlay() }
                </div>
                <div>
                    <Table dataSource={currentGroup.apis}>
                        <Table.Column title="接口名称" cell={this.nameCellRender} />
                        <Table.Column title="接口路径" cell={this.methodCellRender} />
                        {
                            this.apiStore.apiGroups.length && <Table.Column title="接口组别" cell={this.groupRender} />
                        }
                    </Table>
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
};
