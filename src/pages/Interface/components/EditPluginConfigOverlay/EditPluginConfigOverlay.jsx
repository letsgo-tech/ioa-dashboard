import React, { Component } from 'react';
import { Icon, Overlay, Loading, Input, Balloon, Button, Feedback } from '@icedesign/base';
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
        return this.pluginStore.plugins;
    }

    @computed
    get currentConfigTpls() {
        return this.pluginStore.currentConfigTpls;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            try {
                this.pluginStore.fetchConfigTpl(nextProps.name);
            } catch (e) {
                Feedback.toast.error('获取配置项失败');
            }
        }
    }

    validateFields() {
        const { validateFields } = this.refs.form;

        validateFields(async (errors, values) => {
            if (!errors) {
                this.props.submit(values);
            } else {
                console.error(values);
            }
        });
    }

    onClose() {
        this.pluginStore.currentConfigTpls = [];
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
            >
                <div className="overlay-form-container">
                    {
                        this.currentConfigTpls.length ?
                            <div>
                                <h4 style={styles.header}>
                                    更改配置 ({this.props.name})
                                </h4>
                                <Loading shape="flower" tip="loading..." color="#666" visible={this.state.loading}>
                                    <FormBinderWrapper
                                        value={this.props.value}
                                        ref="form"
                                        key={Math.random()}
                                    >
                                        {
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
                                    <div style={{ textAlign: 'end', padding: '10px 0' }}>
                                        <Button type="normal" onClick={() => this.onClose()} style={{ marginRight: '10px' }}>
                                            取 消
                                        </Button>
                                        <Button type="primary" onClick={() => this.validateFields()} loading={this.props.updating}>
                                            提 交
                                        </Button>
                                    </div>
                                </Loading>
                            </div> :
                            <div style={{ padding: '10px' }}>
                                <Icon type="loading" /> 正在获取配置模板 。。。
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
