import React, { Component } from 'react';
import { Icon, Overlay, Loading, Input, Select, Feedback, Balloon, Button } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import './index.scss';

const { Option } = Select;

@inject('stores')
@observer
export default class ConfigPluginOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            value: {},
            selectedId: '',
            inputing: false,
        };
    }

    @computed
    get pluginStore() {
        return this.props.stores.pluginStore;
    }

    @computed
    get plugins() {
        return this.pluginStore.plugins;
    }

    @computed
    get currentConfigTpls() {
        return this.pluginStore.currentConfigTpls;
    }

    componentDidMount() {
        this.pluginStore.listPlugin();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.inputing) {
            return false;
        }

        return true;
    }

    async onSelected(id) {
        this.setState({ selectedId: id, inputing: false });

        if (id === this.pluginStore.currentPlugin.id) return;
        this.setState({ loading: true });
        try {
            await this.pluginStore.fetchPlugin(id);
            await this.pluginStore.fetchConfigTpl(this.pluginStore.currentPlugin.name);
            const value = {};
            this.currentConfigTpls.slice().forEach(item => value[item.name] = '');
            this.setState({ value });
        } catch (e) {
            console.error(e.message);
            Feedback.toast.error('获取插件失败，请稍后重试');
        } finally {
            this.setState({ loading: false });
        }
    }

    onClose() {
        this.props.onCloseOverlay();
        this.setState({ inputing: false, selectedId: '', value: {} });
    }

    validateFields() {
        const { validateFields } = this.refs.form;
        const { currentPlugin } = this.pluginStore;

        validateFields(async (errors, values) => {
            if (!errors) {
                this.setState({ inputing: false });
                const plugin = {
                    id: currentPlugin.id,
                    name: currentPlugin.name,
                    config: values,
                };
                this.props.submit(plugin);
            } else {
                console.error(values);
            }
        });
    }

    render() {
        return (
            <Overlay
                visible={this.props.visible}
                hasMask
                disableScroll
                align="cc cc"
                canCloseByOutSideClick={false}
                onRequestClose={() => this.onClose()}
            >
                <div className="overlay-form-container">
                    <h4 style={styles.header}>
                        添加插件
                    </h4>
                    <div className="form-item">
                        <span className="form-item-label">选择插件：</span>
                        <Select
                            style={{ width: '200px' }}
                            onChange={id => this.onSelected(id)}
                            value={this.state.selectedId}
                        >
                            {
                                this.plugins.slice().map(item => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                })
                            }
                        </Select>
                    </div>
                    {
                        this.state.selectedId &&
                        <Loading shape="flower" tip="loading..." color="#666" visible={this.state.loading}>
                            <FormBinderWrapper
                                value={this.state.value}
                                onChange={value => this.setState({ inputing: true, value })}
                                ref="form"
                                key={Math.random()}
                            >
                                {
                                    this.currentConfigTpls.length &&
                                    this.currentConfigTpls.slice().map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <div className="form-item">
                                                    <span className={`form-item-label ${item.required && 'required'}`}>{item.name}：</span>
                                                    <FormBinder name={`${item.name}`} required={item.required} message={`请输入${item.name}`}>
                                                        {
                                                            item.fieldType === 'string' ?
                                                                <Input
                                                                    htmlType="string"
                                                                    size="large"
                                                                    placeholder={`${item.name}`}
                                                                /> :
                                                                <Input
                                                                    htmlType="number"
                                                                    size="large"
                                                                    min={0}
                                                                    placeholder={`${item.name}`}
                                                                />
                                                        }
                                                    </FormBinder>
                                                    <Balloon
                                                        trigger={<Icon style={{ marginLeft: '10px' }} type="warning" />}
                                                        triggerType="hover"
                                                    >
                                                        { item.desc }
                                                    </Balloon>
                                                </div>
                                                { item.required && <FormError name={`${item.name}`} /> }
                                            </div>
                                        );
                                    })
                                }
                            </FormBinderWrapper>
                            {
                                this.state.selectedId &&
                                <div style={{ textAlign: 'end', padding: '10px 0' }}>
                                    <Button type="normal" onClick={() => this.onClose()} style={{ marginRight: '10px' }}>
                                        取 消
                                    </Button>
                                    <Button type="primary" onClick={() => this.validateFields()} loading={this.props.updating}>
                                        提 交
                                    </Button>
                                </div>
                            }
                        </Loading>
                    }
                </div>
            </Overlay>
        );
    }
}

const styles = {
    header: {
        alignItems: 'center',
        display: 'flex',
    },
};
