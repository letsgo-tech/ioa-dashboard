import React, { Component } from 'react';
import { Button, Icon, Overlay, Loading, Message, Collapse , Select, Grid } from '@alifd/next';
import BalloonConfirm from '@icedesign/balloon-confirm';
import IceLabel from '@icedesign/label';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

const Panel = Collapse.Panel;
const { Row, Col } = Grid;

@inject('stores')
@observer
export default class PolicyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            policies: [],
        };
    }

    @computed
    get apiStore() {
        return this.props.stores.apiStore;
    }

    @computed
    get policyStore() {
        return this.props.stores.policyStore;
    }

    @computed
    get apiPolicies() {
        return this.apiStore.currentApi.policiesData || [];
    }

    componentDidMount() {
        if (!this.policyStore.policies.length) {
            this.policyStore.listPolicy();
        }
    }

    @computed
    get policySource() {
        const policyIdArr = this.apiStore.currentApi.policies || [];
        const { policies } = this.policyStore;
        const source = [];

        for (let i = 0; i < policies.length; i++) {
            if (!policyIdArr.includes(policies[i].id)) {
                const obj = {};
                obj.label = policies[i].name;
                obj.value = policies[i].id;
                source.push(obj);
            }
        }

        return source;
    }

    addPolicy() {
        const { policies } = this.state;
        const { currentApi } = this.apiStore;

        if (policies && policies.length) {
            const data = (policies.concat(currentApi.policies)).filter(item => item);
            this.updateApiPolicy(data);
        }
    }

    deletePolicy(index) {
        const policies = this.apiStore.currentApi.policies.slice();
        policies.splice(index, 1);
        this.updateApiPolicy(policies);
    }

    async updateApiPolicy(policies) {
        const { currentApi } = this.apiStore;
        currentApi.policiesData = [];
        currentApi.policies = policies;
        try {
            this.setState({ loading: true });
            await this.apiStore.putApi(currentApi);
            this.setState({ loading: false });
            this.onCloseOverlay();
        } catch (e) {
            this.setState({ loading: false });
            Message.error('add policy failed, please try again later');
            throw e;
        }
    }

    onCloseOverlay() {
        this.setState({
            visible: false,
            policies: [],
        });
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
                onRequestClose={() => this.onCloseOverlay()}
                offset={[0, -240]}
            >
                <Loading shape="flower" tip="creating..." color="#666" visible={this.state.loading}>
                    <div className="overlay-form-container">
                        <h4 style={{ paddingTop: '10px' }}>
                            Add Plugin
                        </h4>
                        <div className="form-item">
                            <span className="form-item-label" style={{ width: '120px' }}>select policies：</span>
                            <div style={{ display: 'flex' }}>
                                <Select
                                    mode="tag"
                                    style={{ width: '220px' }}
                                    dataSource={this.policySource}
                                    value={this.state.policies}
                                    placeholder="policies"
                                    onChange={policies => {
                                        this.setState({ policies });
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'end', padding: '10px 0' }}>
                            <Button type="normal" onClick={() => this.onCloseOverlay()} style={{ marginRight: '10px' }}>
                                cancel
                            </Button>
                            <Button type="primary" onClick={() => this.addPolicy()} disabled={!(this.state.policies && this.state.policies.length)}>
                                submit
                            </Button>
                        </div>
                    </div>
                </Loading>
            </Overlay>
        );
    }

    renderOperateCell = (name, index) => {
        return (
            <span>
                <BalloonConfirm
                    onConfirm={() => this.deletePolicy(index)}
                    title={`Delete ${name}`}
                ><span><Icon type="ashbin" size="small" /></span>
                </BalloonConfirm>
            </span>
        );
    }

    renderPluginCell = (plugins) => {
        if (!plugins) return '';
        let data;
        try {
            data = JSON.parse(plugins);
        } catch (e) {
            data = [];
        }

        return (
            <div>
                {
                    data.map((item, idx) => {
                        return (
                            <span key={idx}>
                                <IceLabel style={{ margin: '4px' }} status="info">{item.name}</IceLabel>
                            </span>
                        );
                    })
                }
            </div>
        );
    }

    renderPanelContent(plugins) {
        if (!plugins) return '';
        let data;
        try {
            data = JSON.parse(plugins);
        } catch (e) {
            data = [];
        }

        return (
            <div>
                {
                    data.map((item, index) => {
                        return (
                            <li key={index} style={{ borderBottom: '1px solid #ccc' }}>
                                {item.name} :
                                {
                                    Object.keys(item.config).map((key, idx) => {
                                        return <IceLabel key={idx} inverse={false} style={{ margin: '4px' }} status="default">{key} : {item.config[key]}</IceLabel>;
                                    })
                                }
                            </li>
                        );
                    })
                }
            </div>
        );
    }

    render() {
        return (
            <div style={{ marginLeft: '16px' }}>
                <div style={styles.secTitle}>
                    <h5 style={styles.infoColumnTitle}>Policy</h5>
                    <Button
                        size="medium"
                        type="primary"
                        onClick={() => {
                            this.setState({ visible: true, policies: this.currentPolicies });
                        }}
                    >
                        Add
                    </Button>
                </div>
                <div>
                    {
                        this.apiPolicies.length ?
                            <div>
                                <Row>
                                    <Col span="3" style={styles.pluginCol}>name</Col>
                                    <Col span="18" style={styles.pluginCol}>plugins</Col>
                                    <Col span="3" style={styles.pluginCol}>operation</Col>
                                </Row>
                                <Collapse according="true">
                                    {
                                        this.apiPolicies.slice().map((item, index) => {
                                            return (
                                                <Panel
                                                    key={index}
                                                    title={
                                                        <Row>
                                                            <Col span="3" style={styles.pluginCol}>{ item.name }</Col>
                                                            <Col span="18" style={styles.pluginCol}>{ this.renderPluginCell(item.plugins) }</Col>
                                                            <Col span="3" style={styles.pluginCol}>{ this.renderOperateCell(item.name, index) }</Col>
                                                        </Row>
                                                    }
                                                >
                                                    <ul>
                                                        { this.renderPanelContent(item.plugins) }
                                                    </ul>
                                                </Panel>
                                            );
                                        })
                                    }
                                </Collapse>
                            </div> :
                            <div style={styles.pluginCol}>empty</div>
                    }
                </div>
                { this.renderOverlay() }
            </div>
        );
    }
}

const styles = {
    secTitle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
    },
    infoColumnTitle: {
        margin: '20px 0',
        paddingLeft: '10px',
        borderLeft: '3px solid #3080fe',
        fontWeight: 500,
    },
    pluginCol: {
        alignItems: 'center',
        display: 'flex',
        borderBottom: '1px solid #EEEFF3',
        padding: '6px',
    },
};
