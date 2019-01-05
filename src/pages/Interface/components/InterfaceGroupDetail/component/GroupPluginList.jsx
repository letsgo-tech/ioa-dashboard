import React, { Component } from 'react';
import { Button, Feedback, Icon, Grid } from '@icedesign/base';
import BalloonConfirm from '@icedesign/balloon-confirm';
import IceLabel from '@icedesign/label';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import AddPluginOverlay from '../../AddPluginOverlay/AddPluginOverlay';
import EditPluginConfigOverlay from '../../EditPluginConfigOverlay/EditPluginConfigOverlay';

const { Row, Col } = Grid;

@inject('stores')
@observer
export default class GroupPluginList extends Component {
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
    get apiStore() {
        return this.props.stores.apiStore;
    }

    @computed
    get pluginStore() {
        return this.props.stores.pluginStore;
    }

    @computed
    get groupPlugins() {
        if (this.apiStore.currentGroup.plugins) {
            return JSON.parse(this.apiStore.currentGroup.plugins);
        }

        return [];
    }

    componentDidMount() {
        this.pluginStore.listPlugin();
    }

    addPlugin(plugin) {
        const plugins = this.groupPlugins.slice();
        plugins.push(plugin);
        this.updateGroupPlugin(plugins);
    }

    async updatePluginConfig(config) {
        const { selectedIndex } = this.state;
        const plugins = this.groupPlugins.slice();
        plugins[selectedIndex].config = config;
        await this.updateGroupPlugin(plugins);
        this.onCloseOverlay();
    }

    deletePlugin(index) {
        const plugins = this.groupPlugins.slice();
        plugins.splice(index, 1);
        this.updateGroupPlugin(plugins);
    }

    ascendPlugin(index) {
        const item = this.groupPlugins[index];
        const prevItem = this.groupPlugins[index - 1];
        const plugins = this.groupPlugins.slice();
        plugins[index - 1] = item;
        plugins[index] = prevItem;
        this.updateGroupPlugin(plugins);
    }

    descendPlugin(index) {
        const item = this.groupPlugins[index];
        const nextItem = this.groupPlugins[index + 1];
        const plugins = this.groupPlugins.slice();
        plugins[index + 1] = item;
        plugins[index] = nextItem;
        this.updateGroupPlugin(plugins);
    }

    async updateGroupPlugin(plugins) {
        const { id } = this.apiStore.currentGroup;
        try {
            this.setState({ updating: true });
            await this.apiStore.patchApiGroup(id, { plugins: JSON.stringify(plugins) });
            this.setState({ updating: false, isAdding: false });
        } catch (e) {
            this.setState({ updating: false });
            Feedback.toast.error(e.message || '添加插件失败，请稍后重试');
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
            <div>
                <div style={styles.secTitle}>
                    <h5 style={styles.infoColumnTitle}>插件</h5>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            this.setState({ isAdding: true });
                        }}
                    >
                        新增
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
                        this.groupPlugins.length ?
                            <div>
                                <Row>
                                    <Col span="2" style={styles.pluginCol}>次序</Col>
                                    <Col span="6" style={styles.pluginCol}>名称</Col>
                                    <Col span="8" style={styles.pluginCol}>配置</Col>
                                    <Col span="4" style={styles.pluginCol}>排序</Col>
                                    <Col span="4" style={styles.pluginCol}>操作</Col>
                                </Row>
                                {
                                    this.groupPlugins.slice().map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <Row>
                                                    <Col span="2" style={styles.pluginCol}>{index + 1}</Col>
                                                    <Col span="6" style={styles.pluginCol}>{item.name}</Col>
                                                    <Col span="8" style={styles.pluginCol}>
                                                        {
                                                            item.config ?
                                                                Object.keys(item.config).map((key, idx) => (
                                                                    <span key={idx}>
                                                                        <IceLabel style={{ margin: '4px' }} inverse={false} status="primary">{key} : {item.config[key]}</IceLabel>
                                                                    </span>
                                                                )) : '无'
                                                        }
                                                    </Col>
                                                    <Col span="4" style={styles.pluginCol}>
                                                        <span>
                                                            <Icon
                                                                type="descending"
                                                                style={(index === this.groupPlugins.length - 1) ? {} : { color: '#5294fc' }}
                                                                onClick={() => {
                                                                    if (index !== this.groupPlugins.length - 1) {
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
                                                                const plugin = this.groupPlugins.slice()[index] || {};
                                                                this.setState({ isEditing: true, selectedIndex: index, selectedName: plugin.name, selectedValue: Object.assign({}, plugin.config) });
                                                            }}
                                                            >
                                                                编辑
                                                            </a>
                                                            <span> | </span>
                                                            <BalloonConfirm
                                                                onConfirm={() => this.deletePlugin(index)}
                                                                title={`删除 ${item.name}`}
                                                            >
                                                                <span>删除</span>
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
                            <div style={styles.pluginCol}>无</div>
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