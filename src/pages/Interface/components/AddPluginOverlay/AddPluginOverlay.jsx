import React, { Component } from 'react';
import { Icon, Overlay, Loading, Input, Select, Feedback, Balloon, Button } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import './index.scss';

const { Option } = Select;

@inject('stores')
@observer
export default class AddPluginOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentPlugin: '',
            value: {},
            selectedName: '',
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

    componentDidMount() {
        this.pluginStore.listPlugin();
    }

    onSelected(name) {
        this.setState({ selectedName: name, value: {} });

        for (let i = 0; i < this.plugins.length; i++) {
            if (this.plugins[i].name === name) {
                this.setState({ currentPlugin: this.plugins[i] });
                return;
            }
        }
    }

    onClose() {
        this.props.onCloseOverlay();
        this.setState({ selectedName: '', value: {} });
    }

    validateFields() {
        const { validateFields } = this.refs.form;
        const { currentPlugin } = this.state;

        validateFields(async (errors, values) => {
            if (!errors) {
                const plugin = {
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
                            onChange={val => this.onSelected(val)}
                            value={this.state.selectedName}
                        >
                            {
                                this.plugins.slice().map((item, idx) => {
                                    return <Option key={idx} value={item.name}>{item.name}</Option>;
                                })
                            }
                        </Select>
                    </div>
                    {
                        this.state.selectedName &&
                        <Loading shape="flower" tip="loading..." color="#666" visible={this.state.loading}>
                            <FormBinderWrapper
                                value={this.state.value}
                                ref="form"
                                key={Math.random()}
                            >
                                {
                                    this.state.currentPlugin &&
                                    this.state.currentPlugin.configTpl.length &&
                                    this.state.currentPlugin.configTpl.map((item, index) => {
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
                                this.state.selectedName &&
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
