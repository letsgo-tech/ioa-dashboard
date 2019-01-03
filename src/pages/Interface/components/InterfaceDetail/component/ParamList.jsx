import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Dialog, Select, Table } from '@icedesign/base';
import BalloonConfirm from '@icedesign/balloon-confirm';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

import { inject, observer } from 'mobx-react';

const locations = [
    { label: 'query', value: 'query' },
    { label: 'path', value: 'path' },
    { label: 'form', value: 'form' },
];

@inject('stores')
@observer
export default class ParamList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            isCreating: false,
            isPatching: false,
            value: {
                name: '',
                targetName: '',
                location: 'path',
            },
            currentParamId: '',
        };
    }

    componentDidMount() { }

    validateFields = () => {
        const { validateFields } = this.refs.form;
        const { apiStore } = this.props.stores;
        const { currentApi } = apiStore;
        const { currentParamId } = this.state;

        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    this.setState({ loading: true });
                    if (this.state.isCreating) {
                        await apiStore.createParam({ apiId: currentApi.id, ...values });
                    }

                    if (this.state.isPatching) {
                        await apiStore.patchParam(currentParamId, values);
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

    onCloseOverlay() {
        this.setState({
            visible: false,
            isCreating: false,
            isPatching: false,
            value: { name: '', targetName: '', location: 'path' },
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
                        <h4 style={{ paddingTop: '10px' }}>添加参数</h4>
                        <FormBinderWrapper
                            value={this.state.value}
                            onChange={value => this.setState({ value })}
                            ref="form"
                        >
                            <div>
                                <div>
                                    <div className="form-item">
                                        <span className="form-item-label required">参数名称：</span>
                                        <FormBinder name="name" required message="请输参数名称">
                                            <Input
                                                size="large"
                                                placeholder="接口名称"
                                            />
                                        </FormBinder>
                                    </div>
                                    <FormError name="name" />
                                </div>

                                {
                                    this.state.value.name &&
                                    <div>
                                        <div className="form-item">
                                            <span className="form-item-label required">目标名称：</span>
                                            <FormBinder name="targetName" required message="请输目标参数名称">
                                                <Input
                                                    size="large"
                                                    placeholder="目标参数名称"
                                                />
                                            </FormBinder>
                                        </div>
                                        <FormError name="targetName" />
                                    </div>
                                }

                                <div className="form-item">
                                    <span className="form-item-label required">参数位置：</span>
                                    <div style={{ display: 'flex' }}>
                                        <FormBinder name="location" required message="参数位置">
                                            <Select
                                                style={{ height: '32px', lineHeight: '32px' }}
                                                dataSource={locations}
                                                placeholder="参数位置"
                                            />
                                        </FormBinder>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'end', padding: '10px 0' }}>
                                <Button type="normal" onClick={() => this.onCloseOverlay()} style={{ marginRight: '10px' }}>
                                    取 消
                                </Button>
                                <Button type="primary" onClick={() => this.validateFields()} disabled={!(this.state.value.name)}>
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
        const { id, name, targetName, location } = record;

        return (
            <span>
                <a onClick={() => {
                    this.setState({ visible: true, isCreating: false, isPatching: true, value: { name, targetName, location }, currentParamId: id });
                }}
                >
                    编辑
                </a>
                <span> | </span>
                <BalloonConfirm
                    onConfirm={async () => {
                        try {
                            await apiStore.deleteParam(record.id);
                        } catch (e) {
                            Feedback.toast.error(e.message || '删除失败， 请稍后重试');
                        }
                    }}
                    title={`删除${record.name}`}
                ><span>删除</span>
                </BalloonConfirm>
            </span>
        );
    }

    render() {
        const { params } = this.props.stores.apiStore;

        return (
            <div>
                <div style={styles.secTitle}>
                    <h5 style={styles.infoColumnTitle}>请求参数</h5>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            this.setState({ visible: true, isCreating: true, isPatching: false });
                        }}
                    >
                        新增
                    </Button>
                </div>
                <div>
                    {
                        params.length ?
                            <Table dataSource={params.slice()}>
                                <Table.Column title="参数名称" dataIndex="name" />
                                <Table.Column title="目标名称" dataIndex="targetName" />
                                <Table.Column title="参数位置" dataIndex="location" />
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
