import React, { Component } from 'react';
import { Table, Tag, Button, Overlay, Loading, Input, Select, Message } from '@alifd/next';
import IceLabel from '@icedesign/label';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import { Link } from 'react-router-dom';

import './index.scss';

@inject('stores')
@observer
export default class AllPolicy extends Component {
    static displayName = 'AllPolicy';

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isCreating: false,
            name: '',
            describe: '',
        };
    }

    @computed
    get policyStore() {
        return this.props.stores.policyStore;
    }

    componentDidMount() {
        this.policyStore.listPolicy();
    }

    submit = async () => {
        const { name, describe } = this.state;
        const values = { name, describe };

        if (name) {
            try {
                this.setState({ isCreating: true });
                await this.policyStore.createPolicy(values);
                this.setState({ isCreating: false, visible: false });
                Message.success('add policy success');
                this.setState({ name: '', describe: '' });
                await this.policyStore.listPolicy();
            } catch (e) {
                this.setState({ isCreating: false });
                Message.error(e.message || 'add policy failed, please try again later');
            }
        }
    }

    nameCellRender = (val, index, record) => {
        const { name, id } = record;
        return (
            <Link
                key={index}
                to={`/policy/${id}`}
                style={{ fontSize: '16px' }}
            > {name}
            </Link>
        );
    }

    pluginCellRender = (val, index, record) => {
        const { plugins } = record;
        let data;
        try {
            data = JSON.parse(plugins);
        } catch (error) {
            console.log('parse plugins failed');
            data = [];
        }
        return (
            <div>
                {
                    data.map((item, idx) => {
                        return (
                            <span key={idx}>
                                <IceLabel style={{ margin: '4px' }} inverse={false} status="primary">{item.name}</IceLabel>
                            </span>
                        );
                    })
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
                        <h4 style={{ paddingTop: '10px' }}>Add policy</h4>
                        <div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>name：</span>
                                <Input
                                    hasClear={true}
                                    style={styles.formInput}
                                    value={this.state.name}
                                    placeholder="policy name"
                                    onChange={name => this.setState({ name })}
                                />
                            </div>
                            <div className="form-item">
                                <span style={styles.formItemLabel}>describe：</span>
                                <Input
                                    hasClear={true}
                                    style={styles.formInput}
                                    value={this.state.describe}
                                    placeholder="policy describe"
                                    onChange={describe => this.setState({ describe })}
                                />
                            </div>
                        </div>
                        <div style={{ textAlign: 'end', padding: '10px 0' }}>
                            <Button type="normal" onClick={() => this.setState({ visible: false })} style={{ marginRight: '10px' }}>
                                cancel
                            </Button>
                            <Button type="primary" onClick={() => this.submit()} disabled={!this.state.name}>
                                submit
                            </Button>
                        </div>
                    </div>
                </Loading>
            </Overlay>
        );
    }

    render() {
        const { policies } = this.policyStore;
        return (
            <div>
                <div style={styles.header}>
                    <h2>ALL { policies instanceof Array ? ` counts：${policies.length} ` : '' }</h2>
                    <Button type="primary" onClick={() => this.setState({ visible: true })}>Add Policy</Button>
                    { this.renderOverlay() }
                </div>
                <Table dataSource={policies}>
                    <Table.Column title="name" cell={this.nameCellRender} />
                    <Table.Column title="plugins" cell={this.pluginCellRender} />
                    <Table.Column title="describe" dataIndex="describe" />
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
        minWidth: '70px',
        width: '70px',
        textAlign: 'end',
    },
};
