import React, { Component } from 'react';
import { Table, Tag, Button, Overlay, Loading, Input, Select, Message } from '@alifd/next';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import { Link } from 'react-router-dom';

import './AllInterface.scss';

const methodSource = [
    { label: '*', value: 'all' },
    { label: 'GET', value: 'get' },
    { label: 'POST', value: 'post' },
    { label: 'PUT', value: 'put' },
    { label: 'DELETE', value: 'delete' },
    { label: 'PATCH', value: 'patch' },
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
            methods: [],
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
        const { name, methods, path, tags } = this.state;
        const values = { name, methods, path, tags };

        try {
            this.setState({ isCreating: true });
            await apiStore.createApi(values);
            this.setState({ isCreating: false, visible: false });
            Message.success('add api success');
            this.setState({ name: '', methods: [], path: '', tags: [] });
            await apiStore.listApisWithTag();
        } catch (e) {
            this.setState({ isCreating: false });
            Message.error(e.message || 'add api failed, please try again later');
        }
    }

    nameCellRender = (val, index, record) => {
        const { name, id } = record;
        return (
            <Link
                key={index}
                to={`/interface/${id}`}
                style={{ fontSize: '16px' }}
            > {name}
            </Link>
        );
    }

    methodCellRender = (val, index, record) => {
        const { methods } = record;
        return (
            <div>
                {
                    methods instanceof Array ?
                        methods.map((method, idx) => {
                            return <Tag key={idx} type="primary" size="small" className={`${method.toLowerCase()}-tag`} style={{ color: '#666', marginLeft: '4px' }}>{ method }</Tag>;
                        }) : null
                }
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
                        <h4 style={{ paddingTop: '10px' }}>Add Api</h4>
                        <div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>name：</span>
                                <Input
                                    hasClear={true}
                                    style={styles.formInput}
                                    value={this.state.name}
                                    placeholder="name"
                                    onChange={name => this.setState({ name })}
                                />
                            </div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>method：</span>
                                <Select
                                    arial-label="method"
                                    mode="tag"
                                    onChange={m => {
                                        if (m.includes('all')) {
                                            m = ['get', 'post', 'put', 'delete', 'patch'];
                                        }
                                        this.setState({ methods: m });
                                    }}
                                    style={{ flex: 1 }}
                                    value={this.state.methods}
                                    dataSource={methodSource}
                                    placeholder="select method"
                                />
                            </div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>path：</span>
                                <Input
                                    hasClear={true}
                                    placeholder="/path"
                                    aria-label="please input"
                                    value={this.state.path}
                                    onChange={path => this.setState({ path })}
                                />
                            </div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>tag：</span>
                                <Select
                                    arial-label="tag"
                                    mode="tag"
                                    onChange={tags => this.setState({ tags })}
                                    style={{ flex: 1 }}
                                    value={this.state.tags}
                                    dataSource={this.tagSource}
                                    placeholder="select or input"
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'end', padding: '10px 0' }}>
                            <Button type="normal" onClick={() => this.setState({ visible: false })} style={{ marginRight: '10px' }}>
                                cancel
                            </Button>
                            <Button type="primary" onClick={() => this.submit()} disabled={!(this.state.name || this.state.path)}>
                                submit
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
                    <h2>ALL { apis instanceof Array ? ` counts：${apis.length} ` : '' }</h2>
                    <Button type="primary" onClick={() => this.setState({ visible: true })}>Add Api</Button>
                    { this.renderOverlay() }
                </div>
                <Table dataSource={apis}>
                    <Table.Column title="name" cell={this.nameCellRender} />
                    <Table.Column title="path" dataIndex="path" />
                    <Table.Column title="method" cell={this.methodCellRender} />
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
        minWidth: '60px',
        width: '60px',
        textAlign: 'end',
    },
};
