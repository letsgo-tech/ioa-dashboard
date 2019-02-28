import React, { Component } from 'react';
import { Button, Input, Message, Dialog, Grid, Tag, Select } from '@alifd/next';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import PolicyPluginList from './PolicyPluginList';

import './index.scss';

const { Row, Col } = Grid;

@inject('stores')
@observer
export default class PolicyDetail extends Component {
    static displayName = 'PolicyDetail';

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isLoading: false,
            name: '',
            describe: '',
        };
    }

    @computed
    get policyStore() {
        return this.props.stores.policyStore;
    }

    async componentDidMount() {
        const policyId = this.props.match.params.id;
        this.fetchPolicy(policyId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            const policyId = nextProps.match.params.id;
            this.fetchPolicy(policyId);
        }
    }

    async fetchPolicy(id) {
        try {
            await this.policyStore.fetchPolicy(id);
        } catch (e) {
            Message.error('fetch policy detail failed');
        }
    }

    async updatePolicy() {
        const { currentPolicy } = this.policyStore;
        const { name, status, describe } = this.state;
        if (!name) {
            alert('name cannot be empty');
            return;
        }

        const policy = Object.assign({}, currentPolicy, { name, status, describe });
        try {
            this.setState({ isLoading: true });
            await this.policyStore.putPolicy(policy);
            this.setState({ isLoading: false, isEdit: false });
        } catch (e) {
            this.setState({ isLoading: false });
            Message.error('update failed, please try again later');
        }
    }

    onEdit() {
        const { name, status, describe } = this.policyStore.currentPolicy;
        this.setState({ isEdit: true, name, status, describe });
    }

    onDelete() {
        const { id, name } = this.policyStore.currentPolicy;
        Dialog.confirm({
            content: `confirm delete ${name} ?`,
            title: 'delete policy',
            onOk: async () => {
                try {
                    await this.props.stores.policyStore.deletePolicy(id);
                    Message.success('policy has been deleted successfully');
                    this.props.history.replace('/policy');
                } catch (e) {
                    Message.error('delete policy failed');
                }
            },
        });
    }

    render() {
        const { currentPolicy } = this.policyStore;
        return (
            <div>
                <h2 style={styles.basicDetailTitle}>Detail ({currentPolicy.name})</h2>

                <div style={styles.infoColumn}>
                    <div style={styles.secTitle}>
                        <h5 style={styles.infoColumnTitle}>Basic Info</h5>
                        {
                            this.state.isEdit ?
                                <div>
                                    <Button size="medium" onClick={() => this.setState({ isEdit: false })} style={{ marginRight: '6px' }}>cancel</Button>
                                    <Button size="medium" type="primary" loading={this.state.isLoading} onClick={() => this.updatePolicy()}>submit</Button>
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
                                    <span style={styles.infoItemValue}>{currentPolicy.name}</span>
                            }
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>describe：</span>
                            <span style={styles.infoItemValue}>
                                {
                                    this.state.isEdit ?
                                        <Input value={this.state.describe} onChange={describe => this.setState({ describe })} placeholder="describe" /> :
                                        <span style={styles.infoItemValue}>{currentPolicy.describe}</span>
                                }
                            </span>
                        </Col>
                    </Row>
                </div>
                <PolicyPluginList />
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
