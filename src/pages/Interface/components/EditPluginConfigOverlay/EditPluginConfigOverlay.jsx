import React, { Component } from 'react';
import { Icon, Overlay, Loading, Input, Balloon, Button, Message } from '@alifd/next';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';


@inject('stores')
@observer
export default class EditPluginConfigOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    @computed
    get pluginStore() {
        return this.props.stores.pluginStore;
    }

    @computed
    get plugins() {
        return this.pluginStore.allPlugins;
    }

    @computed
    get currentPlugin() {
        for (let i = 0; i < this.plugins.length; i++) {
            if (this.plugins[i].name === this.props.name) {
                return this.plugins[i];
            }
        }

        return {};
    }

    validateFields() {
        const { validateFields } = this.refs.form;

        validateFields(async (errors, values) => {
            Object.keys(values).forEach(key => {
                if (typeof values[key] === 'number') {
                    values[key] = values[key].toString();
                }
            });

            if (!errors) {
                this.props.submit(values);
            } else {
                console.error(values);
            }
        });
    }

    onClose() {
        this.props.onCloseOverlay();
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
                offset={[0, -200]}
            >
                <div className="overlay-form-container">
                    {
                        this.currentPlugin.configTpl &&
                        this.currentPlugin.configTpl.length ?
                            <div>
                                <h4 style={styles.header}>
                                    Modify config ({this.props.name})
                                </h4>
                                <Loading shape="flower" tip="loading..." color="#666" visible={this.state.loading}>
                                    <FormBinderWrapper
                                        value={this.props.value}
                                        ref="form"
                                        key={Math.random()}
                                    >
                                        {
                                            this.currentPlugin.configTpl.slice().map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className="form-item">
                                                            <span className={`form-item-label ${item.required && 'required'}`}>{item.name}：</span>
                                                            <FormBinder name={`${item.name}`} required={item.required} message={`please fill up ${item.name}`}>
                                                                {
                                                                    item.fieldType === 'string' ?
                                                                        <Input
                                                                            htmlType="string"
                                                                            size="medium"
                                                                            placeholder={`${item.name}`}
                                                                        /> :
                                                                        <Input
                                                                            htmlType="number"
                                                                            size="medium"
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
                                    <div style={{ textAlign: 'end', padding: '10px 0' }}>
                                        <Button type="normal" onClick={() => this.onClose()} style={{ marginRight: '10px' }}>
                                            cancel
                                        </Button>
                                        <Button type="primary" onClick={() => this.validateFields()} loading={this.props.updating}>
                                            submit
                                        </Button>
                                    </div>
                                </Loading>
                            </div> :
                            <div style={{ padding: '10px' }}>
                                <Icon type="loading" /> loading template 。。。
                            </div>
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
