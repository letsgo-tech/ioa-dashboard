import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Icon, Select, Grid } from '@icedesign/base';
import BalloonConfirm from '@icedesign/balloon-confirm';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

const { Option } = Select;
const { Row, Col } = Grid;

@inject('stores')
@observer
export default class PluginList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            isAdding: false,
            selectedIndex: '',
            selectedPlugin: {},
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
    get apiPlugins() {
        if (this.apiStore.currentApi.plugins) {
            return JSON.parse(this.apiStore.currentApi.plugins);
        }

        return [];
    }

    componentDidMount() {
        this.pluginStore.listPlugin();
    }

    addPlugin() {
        const plugins = this.apiPlugins.slice();
        plugins.push(this.state.selectedPlugin);
        this.updateApiPlugin(plugins);
    }

    deletePlugin(index) {
        const plugins = this.apiPlugins.slice();
        plugins.splice(index, 1);
        this.updateApiPlugin(plugins);
    }

    ascendPlugin(index) {
        const item = this.apiPlugins[index];
        const prevItem = this.apiPlugins[index - 1];
        const plugins = this.apiPlugins.slice();
        plugins[index - 1] = item;
        plugins[index] = prevItem;
        this.updateApiPlugin(plugins);
    }

    descendPlugin(index) {
        const item = this.apiPlugins[index];
        const nextItem = this.apiPlugins[index + 1];
        const plugins = this.apiPlugins.slice();
        plugins[index + 1] = item;
        plugins[index] = nextItem;
        this.updateApiPlugin(plugins);
    }

    async updateApiPlugin(plugins) {
        const { id } = this.apiStore.currentApi;
        try {
            this.setState({ loading: true });
            await this.apiStore.patchApi(id, { plugins: JSON.stringify(plugins) });
            this.setState({ loading: false, selectedIndex: '', selectedPlugin: {} });
        } catch (e) {
            this.setState({ loading: true });
            Feedback.toast.error(e.message || '添加插件失败，请稍后重试');
        }
    }

    onCloseOverlay() {
        this.setState({
            visible: false,
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
            >
                <Loading shape="flower" tip="creating..." color="#666" visible={this.state.loading}>
                    <div>test</div>
                </Loading>
            </Overlay>
        );
    }

    render() {
        const sourcePlugin = this.pluginStore.plugins;

        return (
            <div>
                <div style={styles.secTitle}>
                    <h5 style={styles.infoColumnTitle}>插件</h5>
                    {
                        this.state.isAdding ?
                            <div style={styles.secTitle}>
                                <Select
                                    style={{ width: '140px' }}
                                    onChange={val => {
                                        this.setState({ selectedIndex: val, selectedPlugin: sourcePlugin[val] });
                                    }}
                                    value={this.state.selectedIndex}
                                >
                                    {
                                        sourcePlugin.map((item, index) => {
                                            return <Option key={index} value={String(index)}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                                <Button
                                    style={{ marginLeft: '10px' }}
                                    size="small"
                                    type="primary"
                                    disabled={!(this.state.selectedPlugin.id)}
                                    loading={this.state.loading}
                                    onClick={() => this.addPlugin()}
                                >
                                    确定
                                </Button>
                                <Button
                                    style={{ marginLeft: '5px' }}
                                    size="small"
                                    disabled={this.setState.loading}
                                    onClick={() => this.setState({ isAdding: false, selectedIndex: '', selectedPlugin: {} })}
                                >
                                    取消
                                </Button>
                            </div> :
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => {
                                    this.setState({ isAdding: true });
                                }}
                            >
                                新增
                            </Button>
                    }
                </div>
                <div>
                    {
                        this.apiPlugins.length ?
                            <div>
                                <Row>
                                    <Col span="2" style={styles.pluginCol}>次序</Col>
                                    <Col span="6" style={styles.pluginCol}>名称</Col>
                                    <Col span="8" style={styles.pluginCol}>描述</Col>
                                    <Col span="4" style={styles.pluginCol}>排序</Col>
                                    <Col span="4" style={styles.pluginCol}>操作</Col>
                                </Row>
                                {
                                    this.apiPlugins.slice().map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <Row>
                                                    <Col span="2" style={styles.pluginCol}>{index + 1}</Col>
                                                    <Col span="6" style={styles.pluginCol}>{item.name}</Col>
                                                    <Col span="8" style={styles.pluginCol}>{item.describe}</Col>
                                                    <Col span="4" style={styles.pluginCol}>
                                                        <span>
                                                            <Icon
                                                                type="descending"
                                                                style={(index === this.apiPlugins.length - 1) ? {} : { color: '#5294fc' }}
                                                                onClick={() => {
                                                                    if (index !== this.apiPlugins.length - 1) {
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
                                                                this.setState({ visible: true });
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
                                { this.renderOverlay() }
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
