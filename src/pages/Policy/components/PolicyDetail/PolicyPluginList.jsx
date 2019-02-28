import React, { Component } from 'react';
import { Button, Message, Icon, Grid } from '@alifd/next';
import BalloonConfirm from '@icedesign/balloon-confirm';
import IceLabel from '@icedesign/label';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import AddPluginOverlay from '../../../Interface/components/AddPluginOverlay/AddPluginOverlay';
import EditPluginConfigOverlay from '../../../Interface/components/EditPluginConfigOverlay/EditPluginConfigOverlay';

const { Row, Col } = Grid;

@inject('stores')
@observer
export default class ApiPluginList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            updating: false,
            isAdding: false,
            selectedIndex: '',
            selectedName: '',
            selectedValue: {},
        };
    }

    @computed
    get policyStore() {
        return this.props.stores.policyStore;
    }

    @computed
    get pluginStore() {
        return this.props.stores.pluginStore;
    }

    @computed
    get policyPlugins() {
        if (this.policyStore.currentPolicy.plugins) {
            return JSON.parse(this.policyStore.currentPolicy.plugins);
        }

        return [];
    }

    componentDidMount() {
        this.pluginStore.listPlugin();
    }

    addPlugin(plugin) {
        const plugins = this.policyPlugins.slice();
        plugins.push(plugin);
        this.updatePolicyPlugin(plugins);
    }

    async updatePluginConfig(config) {
        const { selectedIndex } = this.state;
        const plugins = this.policyPlugins.slice();
        plugins[selectedIndex].config = config;
        await this.updatePolicyPlugin(plugins);
        this.onCloseOverlay();
    }

    deletePlugin(index) {
        const plugins = this.policyPlugins.slice();
        plugins.splice(index, 1);
        this.updatePolicyPlugin(plugins);
    }

    ascendPlugin(index) {
        const item = this.policyPlugins[index];
        const prevItem = this.policyPlugins[index - 1];
        const plugins = this.policyPlugins.slice();
        plugins[index - 1] = item;
        plugins[index] = prevItem;
        this.updatePolicyPlugin(plugins);
    }

    descendPlugin(index) {
        const item = this.policyPlugins[index];
        const nextItem = this.policyPlugins[index + 1];
        const plugins = this.policyPlugins.slice();
        plugins[index + 1] = item;
        plugins[index] = nextItem;
        this.updatePolicyPlugin(plugins);
    }

    async updatePolicyPlugin(plugins) {
        const { currentPolicy } = this.policyStore;
        currentPolicy.plugins = JSON.stringify(plugins);
        try {
            this.setState({ updating: true });
            await this.policyStore.putPolicy(currentPolicy);
            this.setState({ updating: false, isAdding: false });
        } catch (e) {
            this.setState({ updating: false });
            Message.error('add plugin failed, please try again later');
            throw e;
        }
    }

    onCloseOverlay() {
        this.setState({
            isEditing: false,
            isAdding: false,
        });
    }

    render() {
        return (
            <div style={{ marginLeft: '16px' }}>
                <div style={styles.secTitle}>
                    <h5 style={styles.infoColumnTitle}>Plugin</h5>
                    <Button
                        size="medium"
                        type="primary"
                        onClick={() => {
                            this.setState({ isAdding: true });
                        }}
                    >
                        Add
                    </Button>
                    <AddPluginOverlay
                        visible={this.state.isAdding}
                        updating={this.state.updating}
                        onCloseOverlay={() => this.onCloseOverlay()}
                        submit={plugin => this.addPlugin(plugin)}
                    />
                </div>
                <div>
                    {
                        this.policyPlugins.length ?
                            <div>
                                <Row>
                                    <Col span="2" style={styles.pluginCol}>order</Col>
                                    <Col span="6" style={styles.pluginCol}>name</Col>
                                    <Col span="8" style={styles.pluginCol}>config</Col>
                                    <Col span="4" style={styles.pluginCol}>reorder</Col>
                                    <Col span="4" style={styles.pluginCol}>opration</Col>
                                </Row>
                                {
                                    this.policyPlugins.slice().map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <Row>
                                                    <Col span="2" style={styles.pluginCol}>{index + 1}</Col>
                                                    <Col span="6" style={styles.pluginCol}>{item.name}</Col>
                                                    <Col span="8" style={styles.pluginCol}>
                                                        <div>
                                                            {
                                                                item.config ?
                                                                    Object.keys(item.config).map((key, idx) => (
                                                                        <span key={idx}>
                                                                            <IceLabel style={{ margin: '4px' }} inverse={false} status="primary">{key} : {item.config[key]}</IceLabel>
                                                                        </span>
                                                                    )) : '无'
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col span="4" style={styles.pluginCol}>
                                                        <span>
                                                            <Icon
                                                                type="descending"
                                                                style={(index === this.policyPlugins.length - 1) ? {} : { color: '#5294fc' }}
                                                                onClick={() => {
                                                                    if (index !== this.policyPlugins.length - 1) {
                                                                        this.descendPlugin(index);
                                                                    }
                                                                }}
                                                            />
                                                            <Icon
                                                                type="ascending"
                                                                style={(index === 0) ? {} : { color: '#5294fc' }}
                                                                onClick={() => {
                                                                    if (index !== 0) {
                                                                        this.ascendPlugin(index);
                                                                    }
                                                                }}
                                                            />
                                                        </span>
                                                    </Col>
                                                    <Col span="4" style={styles.pluginCol}>
                                                        <span>
                                                            <a onClick={() => {
                                                                const plugin = this.policyPlugins.slice()[index] || {};
                                                                this.setState({ isEditing: true, selectedIndex: index, selectedName: plugin.name, selectedValue: Object.assign({}, plugin.config) });
                                                            }}
                                                            >
                                                                Edit
                                                            </a>
                                                            <span> | </span>
                                                            <BalloonConfirm
                                                                onConfirm={() => this.deletePlugin(index)}
                                                                title={`Delete ${item.name}`}
                                                            >
                                                                <span>Delete</span>
                                                            </BalloonConfirm>
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        );
                                    })
                                }
                                <EditPluginConfigOverlay
                                    visible={this.state.isEditing}
                                    updating={this.state.updating}
                                    value={this.state.selectedValue}
                                    name={this.state.selectedName}
                                    onCloseOverlay={() => this.onCloseOverlay()}
                                    submit={config => this.updatePluginConfig(config)}
                                />
                            </div> :
                            <div style={styles.pluginCol}>empty</div>
                    }
                </div>
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
    },
    pluginCol: {
        alignItems: 'center',
        display: 'flex',
        borderBottom: '1px solid #EEEFF3',
        padding: '12px',
    },
};
