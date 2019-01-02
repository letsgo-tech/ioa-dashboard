import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Dialog, Grid, Tag, Select, Table } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';

const location = [
    { label: 'query', value: 'query' },
    { label: 'path', value: 'path' },
    { label: 'form', value: 'form' },
];

export default class ParamList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isCreating: false,
            value: {
                name: '',
                targetName: '',
                location: 'path',
            },
        };
    }

    componentDidMount() { }

    validateFields = () => {
        const { validateFields } = this.refs.form;
        const { apiStore } = this.props;
        const { currentApi } = apiStore;
        const params = currentApi.params || [];
        const id = currentApi.id;

        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    this.setState({ isCreating: true });
                    params.push({ apiId: id, ...values });
                    await apiStore.patchApi(id, { params });
                    this.setState({ isCreating: false, visible: false });
                    this.setState({ value: { name: '', targetName: '', location: 'path' } });
                } catch (e) {
                    this.setState({ isCreating: false });
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
                onRequestClose={() => this.setState({ visible: false })}
            >
                <Loading shape="flower" tip="creating..." color="#666" visible={this.state.isCreating}>
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
                                        <span style={styles.formItemLabel}>参数名称：</span>
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
                                            <span style={styles.formItemLabel}>目标名称：</span>
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
                                    <span style={styles.formItemLabel}>参数位置：</span>
                                    <div style={{ display: 'flex' }}>
                                        <FormBinder name="location" required message="参数位置">
                                            <Select
                                                style={{ height: '32px', lineHeight: '32px' }}
                                                dataSource={location}
                                                placeholder="参数位置"
                                            />
                                        </FormBinder>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'end', padding: '10px 0' }}>
                                <Button type="normal" onClick={() => this.setState({ visible: false })} style={{ marginRight: '10px' }}>
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

    render() {
        const { params } = this.props.apiStore.currentApi;
        return (
            <div>
                <div style={styles.secTitle}>
                    <h5 style={styles.infoColumnTitle}>请求参数</h5>
                    <Button size="small" type="primary" onClick={() => this.setState({ visible: true })}>新增</Button>
                    { this.renderOverlay() }
                </div>
                <div>
                    {
                        params && params.map((item, idx) => {
                            return (
                                <div key={idx}>test</div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

const styles = {
    secTitle: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    infoColumnTitle: {
        margin: '20px 0',
        paddingLeft: '10px',
        borderLeft: '3px solid #3080fe',
    },
};
