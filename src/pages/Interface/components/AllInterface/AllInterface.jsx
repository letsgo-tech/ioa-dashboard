import React, { Component } from 'react';
import { Table, Tag, Button, Overlay, Loading, Input, Select, Message } from '@alifd/next';

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
            tags: [],
            name: '',
            method: 'get',
            path: '',
        };
    }

    @computed
    get apiStore() {
        return this.props.stores.apiStore;
    }

    @computed
    get tagSource() {
        const { tags } = this.apiStore;
        return Object.keys(tags);
    }

    componentDidMount() {
        this.apiStore.listApi();
    }

    submit = async () => {
        const { apiStore } = this.props.stores;
        const { name, method, path, tags } = this.state;
        const values = { name, method, path, tags };

        try {
            this.setState({ isCreating: true });
            await apiStore.createApi(values);
            this.setState({ isCreating: false, visible: false });
            Message.success('添加接口成功');
            this.setState({ name: '', method: 'get', path: '', tags: [] });
            await apiStore.listApisWithTag();
        } catch (e) {
            this.setState({ isCreating: false });
            Message.error(e.message || '添加接口失败， 请稍后重试');
        }
    }

    nameCellRender = (val, index, record) => {
        const { name, id } = record;
        return (
            <Link
                key={index}
                to={`/interface/api/${id}`}
                style={{ fontSize: '16px' }}
            > {name}
            </Link>
        );
    }

    methodCellRender = (val, index, record) => {
        const { method, path } = record;
        return (
            <div>
                <Tag type="primary" size="small" className={`${method.toLowerCase()}-tag`} style={{ color: '#666' }}>{ method }</Tag>
                <span style={{ fontSize: '14px' }}>  { path }</span>
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
                        <div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>名称：</span>
                                <Input
                                    hasClear={true}
                                    style={styles.formInput}
                                    value={this.state.name}
                                    placeholder="接口名称"
                                    onChange={name => this.setState({ name })}
                                />
                            </div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>路径：</span>
                                <Input.Group
                                    addonBefore={
                                        <Select
                                            dataSource={methods}
                                            placeholder="方法"
                                            value={this.state.method}
                                            onChange={method => this.setState({ method })}
                                        />
                                    }
                                >
                                    <Input
                                        hasClear={true}
                                        style={{ width: '100%' }}
                                        placeholder="/path"
                                        aria-label="please input"
                                        value={this.state.path}
                                        onChange={path => this.setState({ path })}
                                    />
                                </Input.Group>
                            </div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>标签：</span>
                                <Select
                                    arial-label="tag"
                                    mode="tag"
                                    onChange={tags => this.setState({ tags })}
                                    style={{ flex: 1 }}
                                    value={this.state.tags}
                                    dataSource={this.tagSource}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'end', padding: '10px 0' }}>
                            <Button type="normal" onClick={() => this.setState({ visible: false })} style={{ marginRight: '10px' }}>
                                取 消
                            </Button>
                            <Button type="primary" onClick={() => this.submit()} disabled={!(this.state.name || this.state.path)}>
                                提 交
                            </Button>
                        </div>
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
    formInput: {
        flex: 1,
    },
    formItemLabel: {
        display: 'inline-block',
        minWidth: '50px',
        width: '50px',
    },
};
