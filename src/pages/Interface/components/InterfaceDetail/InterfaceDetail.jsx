import React, { Component } from 'react';
import { Button, Input, Message, Dialog, Grid, Tag, Select } from '@alifd/next';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import TargetList from './component/TargetList';
import PolicyList from './component/PolicyList';
import ApiPluginList from './component/ApiPluginList';
import './InterfaceDetail.scss';

const { Row, Col } = Grid;
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
            methods: '',
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
        } catch (e) {
            Message.error('fetch api detail failed');
        }
    }

    async updateApi() {
        const { currentApi } = this.apiStore;
        const { name, methods, path } = this.state;
        if (!name) {
            alert('name cannot be empty');
            return;
        }

        const api = Object.assign({}, currentApi, { name, methods, path });
        try {
            this.setState({ isLoading: true });
            await this.apiStore.putApi(api);
            this.setState({ isLoading: false, isEdit: false });
        } catch (e) {
            this.setState({ isLoading: false });
            Message.error('update failed, please try again later');
        }
    }

    onEdit() {
        const { name, methods, path } = this.apiStore.currentApi;
        this.setState({ isEdit: true, name, methods, path });
    }

    onDelete() {
        const { id, name } = this.apiStore.currentApi;
        Dialog.confirm({
            content: `confirm delete ${name} ?`,
            title: 'delete api',
            onOk: async () => {
                try {
                    await this.props.stores.apiStore.deleteApiById(id);
                    Message.success('api has been deleted successfully');
                    this.props.history.replace('/');
                } catch (e) {
                    Message.error('delete api failed');
                }
            },
        });
    }

    render() {
        const { currentApi } = this.apiStore;
        return (
            <div>
                <h2 style={styles.basicDetailTitle}>Detail ({currentApi.name})</h2>

                <div style={styles.infoColumn}>
                    <div style={styles.secTitle}>
                        <h5 style={styles.infoColumnTitle}>Basic Info</h5>
                        {
                            this.state.isEdit ?
                                <div>
                                    <Button size="medium" onClick={() => this.setState({ isEdit: false })} style={{ marginRight: '6px' }}>cancel</Button>
                                    <Button size="medium" type="primary" loading={this.state.isLoading} onClick={() => this.updateApi()}>submit</Button>
                                </div> :
                                <div>
                                    <Button size="medium" type="secondary" onClick={() => this.onDelete()} style={{ marginRight: '6px' }}>Delete</Button>
                                    <Button size="medium" type="primary" onClick={() => this.onEdit()}>Edit</Button>
                                </div>
                        }
                    </div>
                    <Row wrap style={styles.infoItems}>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>name：</span>
                            {
                                this.state.isEdit ?
                                    <Input value={this.state.name} onChange={name => this.setState({ name })} placeholder="name" /> :
                                    <span style={styles.infoItemValue}>{currentApi.name}</span>
                            }
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>method：</span>
                            <span style={styles.infoItemValue}>
                                {
                                    this.state.isEdit ?
                                        <Select
                                            dataSource={methodSource}
                                            value={this.state.methods}
                                            mode="tag"
                                            onChange={m => {
                                                if (m.includes('all')) {
                                                    m = ['get', 'post', 'put', 'delete', 'patch'];
                                                }
                                                this.setState({ methods: m });
                                            }}
                                        /> :
                                        <div>
                                            {
                                                currentApi.methods instanceof Array ?
                                                    currentApi.methods.map((method, idx) => {
                                                        return <Tag type="primary" key={idx} size="small" className={`${method.toLowerCase()}-tag`} style={{ color: '#666', marginLeft: '4px' }}>{ method }</Tag>;
                                                    }) : null
                                            }
                                        </div>
                                }
                            </span>
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>path：</span>
                            {
                                this.state.isEdit ?
                                    <Input value={this.state.path} onChange={path => this.setState({ path })} placeholder="/{path}" /> :
                                    <span style={styles.infoItemValue}>{currentApi.path}</span>
                            }
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>updated：</span>
                            <span style={styles.infoItemValue}>{new Date(currentApi.updatedAt).toLocaleString()}</span>
                        </Col>
                    </Row>
                </div>
                <TargetList />
                <PolicyList />
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
