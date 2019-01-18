import React, { Component } from 'react';
import { Grid, Table, Tag, Button, Overlay, Loading, Input, Select, Feedback } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import { Link } from 'react-router-dom';

import './AllInterface.scss';

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
export default class AllInterface extends Component {
    static displayName = 'AllInterface';

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

    @computed
    get apiStore() {
        return this.props.stores.apiStore;
    }

    componentDidMount() {
        this.apiStore.listApi();
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
                <Tag shape="readonly" size="medium" className={`${method.toLowerCase()}-tag`} style={{ color: '#666' }}>{ method }</Tag>
                <span>  { path }</span>
            </div>
        );
    }

    renderOverlay = () => {
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
                            ref="form"
                            onChange={value => this.setState({ value })}
                        >
                            <div>
                                <div className="form-item">
                                    <span style={styles.formItemLabel}>组别：</span>
                                    <Input disabled style={{ flex: 1 }} />
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
                                                    style={{ height: '32px', lineHeight: '32px', width: '120px' }}
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
                                <Button type="primary" onClick={() => this.validateFields()} disabled={!(this.state.value.name || this.state.value.path)}>
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
        const { apis } = this.apiStore;
        return (
            <div>
                <div style={styles.header}>
                    <h2>接口列表  { apis instanceof Array ? `接口数：${apis.length} 个` : '' }</h2>
                    <Button type="primary" onClick={() => this.setState({ visible: true })}>添加接口</Button>
                    { this.renderOverlay() }
                </div>
                <Table dataSource={apis}>
                    <Table.Column title="接口名称" cell={this.nameCellRender} />
                    <Table.Column title="接口路径" cell={this.methodCellRender} />
                </Table>
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
