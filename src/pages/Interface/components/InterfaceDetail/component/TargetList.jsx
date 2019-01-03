import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Dialog, Select, Table } from '@icedesign/base';
import BalloonConfirm from '@icedesign/balloon-confirm';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

import { inject, observer } from 'mobx-react';

const methods = [
    { label: 'GET', value: 'get' },
    { label: 'POST', value: 'post' },
    { label: 'PUT', value: 'put' },
    { label: 'DELETE', value: 'delete' },
    { label: 'PATCH', value: 'patch' },
    { label: 'OPTION', value: 'option' },
    { label: 'HEAD', value: 'head' },
    { label: 'CONNECT', value: 'connect' },
];

const schemes = [
    { label: 'HTTP', value: 'http' },
    { label: 'HTTPS', value: 'https' },
];

@inject('stores')
@observer
export default class TargetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            isCreating: false,
            isPatching: false,
            value: {
                method: '',
                scheme: 'http',
                host: '',
                port: '',
                path: '/',
            },
            currentTargetId: '',
        };
    }

    componentDidMount() { }

    onCloseOverlay() {
        this.setState({
            visible: false,
            isCreating: false,
            isPatching: false,
            value: { method: '', scheme: 'http', host: '', port: '', path: '/' },
        });
    }

    validateFields = () => {
        const { validateFields } = this.refs.form;
        const { apiStore } = this.props.stores;
        const { currentApi } = apiStore;
        const { currentTargetId } = this.state;

        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    this.setState({ loading: true });
                    if (this.state.isCreating) {
                        await apiStore.createTarget({ apiId: currentApi.id, ...values });
                    }

                    if (this.state.isPatching) {
                        await apiStore.patchTarget(currentTargetId, values);
                    }
                    this.setState({ loading: false, visible: false });
                    this.onCloseOverlay();
                } catch (e) {
                    this.setState({ loading: false });
                    Feedback.toast.error(e.message || '添加参数失败， 请稍后重试');
                }
            }
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
                    <div className="overlay-form-container">
                        <h4 style={{ paddingTop: '10px' }}>添加转发目标</h4>
                        <FormBinderWrapper
                            value={this.state.value}
                            onChange={value => this.setState({ value })}
                            ref="form"
                        >
                            <div>
                                <div className="form-item">
                                    <span className="form-item-label required">serverMethod：</span>
                                    <FormBinder name="method" required message="请选择请求协议">
                                        <Select
                                            style={{ height: '32px', lineHeight: '32px', width: '120px' }}
                                            dataSource={methods}
                                        />
                                    </FormBinder>
                                </div>

                                <div>
                                    <div className="form-item">
                                        <span className="form-item-label required">serverScheme：</span>
                                        <FormBinder name="scheme" required message="请选择请求协议">
                                            <Select
                                                style={{ height: '32px', lineHeight: '32px', width: '120px' }}
                                                dataSource={schemes}
                                            />
                                        </FormBinder>
                                    </div>
                                    <FormError name="scheme" />
                                </div>

                                <div>
                                    <div className="form-item">
                                        <span className="form-item-label required">serverHost：</span>
                                        <FormBinder name="host" required message="请填写host地址">
                                            <Input
                                                size="large"
                                                placeholder="host地址"
                                            />
                                        </FormBinder>
                                    </div>
                                    <FormError name="host" />
                                </div>

                                <div className="form-item">
                                    <span className="form-item-label">serverPort：</span>
                                    <FormBinder name="port">
                                        <Input
                                            size="large"
                                            placeholder="80"
                                        />
                                    </FormBinder>
                                </div>

                                <div>
                                    <div className="form-item">
                                        <span className="form-item-label required">serverPath：</span>
                                        <FormBinder name="path" required message="请填写路径">
                                            <Input
                                                size="large"
                                                placeholder="/path"
                                            />
                                        </FormBinder>
                                    </div>
                                    <FormError name="path" />
                                </div>
                            </div>

                            <div style={{ textAlign: 'end', padding: '10px 0' }}>
                                <Button type="normal" onClick={() => this.onCloseOverlay()} style={{ marginRight: '10px' }}>
                                    取 消
                                </Button>
                                <Button type="primary" onClick={() => this.validateFields()} disabled={!(this.state.value.host && this.state.value.path)}>
                                    提 交
                                </Button>
                            </div>
                        </FormBinderWrapper>
                    </div>
                </Loading>
            </Overlay>
        );
    }

    renderOperateCell = (val, index, record) => {
        const { apiStore } = this.props.stores;
        const { id, method, scheme, host, port, path } = record;

        return (
            <span>
                <a onClick={() => {
                    this.setState({ visible: true, isCreating: false, isPatching: true, value: { method, scheme, host, port, path }, currentTargetId: id });
                }}
                >
                    编辑
                </a>
                <span> | </span>
                <BalloonConfirm
                    onConfirm={async () => {
                        try {
                            await apiStore.deleteTarget(record.id);
                        } catch (e) {
                            Feedback.toast.error(e.message || '删除失败， 请稍后重试');
                        }
                    }}
                    title={`删除 ${scheme}://${host}${port && ':'}${port}${path}`}
                ><span>删除</span>
                </BalloonConfirm>
            </span>
        );
    }

    renderFullPath = (val, index, record) => {
        const { scheme, host, port, path } = record;
        return (
            <span>{`${scheme}://${host}${port && ':'}${port}${path}`}</span>
        );
    }

    render() {
        const { currentApi, targets } = this.props.stores.apiStore;

        return (
            <div>
                <div style={styles.secTitle}>
                    <h5 style={styles.infoColumnTitle}>转发目标</h5>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            this.setState({ visible: true, isCreating: true, isPatching: false, value: { method: currentApi.method, scheme: 'http', host: '', port: '', path: '/' } });
                        }}
                    >
                        新增
                    </Button>
                </div>
                <div>
                    {
                        targets.length ?
                            <Table dataSource={targets.slice()}>
                                <Table.Column title="路径" cell={this.renderFullPath} />
                                <Table.Column title="请求方法" dataIndex="method" />
                                <Table.Column title="操作" cell={this.renderOperateCell} />
                            </Table> :
                            '无'
                    }
                </div>
                { this.renderOverlay() }
            </div>
        );
    }
}

const styles = {
    secTitle: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
    },
    infoColumnTitle: {
        margin: '20px 0',
        paddingLeft: '10px',
        borderLeft: '3px solid #3080fe',
    },
};
