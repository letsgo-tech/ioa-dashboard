import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Message, Select, Table, Icon } from '@alifd/next';
import BalloonConfirm from '@icedesign/balloon-confirm';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

import { inject, observer } from 'mobx-react';

const methods = [
    { label: ' original ', value: '' },
    { label: 'GET', value: 'get' },
    { label: 'POST', value: 'post' },
    { label: 'PUT', value: 'put' },
    { label: 'DELETE', value: 'delete' },
    { label: 'PATCH', value: 'patch' },
];

const schemes = [
    { label: 'HTTP', value: 'http://' },
    { label: 'HTTPS', value: 'https://' },
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
            isPuting: false,
            value: {
                method: '',
                scheme: 'http://',
                host: '',
                port: '',
                path: '/',
            },
            currentTargetIndex: '',
        };
    }

    componentDidMount() { }

    onCloseOverlay() {
        this.setState({
            visible: false,
            isCreating: false,
            isPuting: false,
            value: { method: '', scheme: 'http://', host: '', port: '', path: '/' },
        });
    }

    validateFields = () => {
        const { validateFields } = this.refs.form;
        const { apiStore } = this.props.stores;
        const { currentApi } = apiStore;
        const { currentTargetIndex } = this.state;

        validateFields(async (errors, values) => {
            if (!errors) {
                if (!(currentApi.targets instanceof Array)) {
                    currentApi.targets = [];
                }

                try {
                    this.setState({ loading: true });
                    if (this.state.isCreating) {
                        currentApi.targets.push(values);
                    }

                    if (this.state.isPuting) {
                        currentApi.targets[currentTargetIndex] = values;
                    }

                    await apiStore.putApi(currentApi);
                    this.setState({ loading: false, visible: false });
                    this.onCloseOverlay();
                } catch (e) {
                    this.setState({ loading: false });
                    Message.error('add failed, please try again later');
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
                        <h4 style={{ paddingTop: '10px' }}>Add target</h4>
                        <FormBinderWrapper
                            value={this.state.value}
                            onChange={value => this.setState({ value })}
                            ref="form"
                        >
                            <div>
                                <div>
                                    <div className="form-item">
                                        <span className="form-item-label required">serverScheme：</span>
                                        <FormBinder name="scheme" required message="choose request protocol">
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
                                        <FormBinder name="host" required message="please fill up host address">
                                            <Input
                                                size="medium"
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
                                            size="medium"
                                            placeholder="80"
                                        />
                                    </FormBinder>
                                </div>

                                <div className="form-item">
                                    <span className="form-item-label">serverMethod：</span>
                                    <FormBinder name="method">
                                        <Select
                                            style={{ height: '32px', lineHeight: '32px', width: '200px' }}
                                            dataSource={methods}
                                            placeholder="original method if empty"
                                        />
                                    </FormBinder>
                                </div>

                                <div>
                                    <div className="form-item">
                                        <span className="form-item-label required">serverPath：</span>
                                        <FormBinder name="path" required message="please fill up path">
                                            <Input
                                                size="medium"
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
        const { currentApi } = apiStore;
        const { method, scheme, host, port, path } = record;

        return (
            <span>
                <a
                    onClick={() => {
                        this.setState({ visible: true, isCreating: false, isPuting: true, value: { method, scheme, host, port, path }, currentTargetIndex: index });
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <Icon type="edit" size="small" />
                </a>
                <span> &nbsp;&nbsp;| &nbsp;&nbsp;</span>
                <BalloonConfirm
                    onConfirm={async () => {
                        try {
                            currentApi.targets.splice(index, 1);
                            await apiStore.putApi(currentApi);
                        } catch (e) {
                            Message.error('delete failed, please try again later');
                        }
                    }}
                    title={`delete ${scheme}${host}${port && ':'}${port}${path}`}
                ><a style={{ cursor: 'pointer' }}><Icon type="ashbin" size="small" /></a>
                </BalloonConfirm>
            </span>
        );
    }

    renderFullPath = (val, index, record) => {
        const { scheme, host, port, path } = record;
        return (
            <span>{`${scheme}${host}${port && ':'}${port}${path}`}</span>
        );
    }

    render() {
        const { currentApi, targets } = this.props.stores.apiStore;

        return (
            <div style={{ marginLeft: '16px' }}>
                <div style={styles.secTitle}>
                    <h5 style={styles.infoColumnTitle}>Forwarding Target</h5>
                    <Button
                        size="medium"
                        type="primary"
                        onClick={() => {
                            this.setState({ visible: true, isCreating: true, isPuting: false, value: { method: currentApi.method, scheme: 'http://', host: '', port: '', path: '/' } });
                        }}
                    >
                        Add
                    </Button>
                </div>
                <div>
                    {
                        targets.length ?
                            <Table dataSource={targets.slice()}>
                                <Table.Column title="path" cell={this.renderFullPath} />
                                <Table.Column title="method" dataIndex="method" />
                                <Table.Column title="operation" cell={this.renderOperateCell} width="140px" />
                            </Table> :
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
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
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
        padding: '12px',
    },
};
