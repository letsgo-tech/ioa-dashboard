/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Dialog } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import IceContainer from '@icedesign/container';
import FoundationSymbol from '@icedesign/foundation-symbol';

import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import './InterfaceGroupList.scss';

@inject('stores')
@observer
export default class InterfaceGroupList extends Component {
    static displayName = 'InterfaceGroupList';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isCreating: false,
            value: {
                name: '',
                describe: '',
            },
        };
    }

    componentWillMount() { }

    componentDidMount() {
        const { apiStore } = this.props.stores;
        apiStore.listApiGroups();
    }

    componentWillUnmount() { }

    onSearchChange(value) {
        console.log(value);
    }

    deleteApiGroup = async (id) => {
        try {
            await this.props.stores.apiStore.deleteApiGroup(id);
            Feedback.toast.success('删除分组成功');
        } catch (e) {
            Feedback.toast.error(e);
        }
    }

    renderItem = (item, idx) => {
        const openState = this.state[`item-${idx}`];
        return (
            <div key={idx}>
                <Link
                    to={`/interface/group/${item.id}`}
                    style={styles.treeCardItem}
                    className="tree-card-item"
                    onClick={() => this.setState({ [`item-${idx}`]: !openState })}
                >
                    <span style={styles.tab}>{item.name}</span>
                    <span className="operate-btns">
                        <span onClick={() => {
                            Dialog.confirm({
                                title: `是否删除该分组：${item.name}`,
                                content: '删除后将无法恢复',
                                onOk: () => this.deleteApiGroup(item.id),
                            });
                        }}
                        >
                            <FoundationSymbol type="delete" size="small" />
                        </span>
                    </span>
                </Link>
                {
                    openState && item.apis ?
                        <ul className="api-item-list">
                            {item.apis.map((api, index) => {
                                return (
                                    <li
                                        className="api-item"
                                        key={index}
                                    >
                                        <Link to={`/interface/api/${api.id}`}>
                                            {api.name}
                                        </Link>
                                        <span className="operate-btns">
                                            <span>
                                                <FoundationSymbol type="delete" size="small" />
                                            </span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul> :
                        ''
                }
            </div>
        );
    };

    validateFields = () => {
        const { validateFields } = this.refs.form;

        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    this.setState({ isCreating: true });
                    await this.props.stores.apiStore.createApiGroup(values);
                    this.setState({ isCreating: false, visible: false });
                    Feedback.toast.success('创建分组成功');
                } catch (error) {
                    Feedback.toast.error('创建失败， 请稍后重试');
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
                safeNode={() => this.refs.target}
                onRequestClose={() => this.setState({ visible: false })}
            >
                <Loading shape="flower" tip="creating..." color="#666" visible={this.state.isCreating}>
                    <div style={styles.formContainer}>
                        <h4 style={{ paddingTop: '10px' }}>新增分组</h4>
                        <FormBinderWrapper
                            value={this.state.value}
                            onChange={value => this.setState({ value })}
                            ref="form"
                        >
                            <div style={styles.formItems}>
                                <div style={styles.formItem}>
                                    <div>
                                        <span style={styles.formItemLabel}>名称：</span>
                                        <FormBinder name="name" required message="请输入正确的名称">
                                            <Input
                                                size="large"
                                                placeholder="组名"
                                                style={styles.inputCol}
                                            />
                                        </FormBinder>
                                    </div>
                                    <FormError name="name" />
                                </div>

                                <div style={styles.formItem}>
                                    <span style={styles.formItemLabel}>描述：</span>
                                    <FormBinder name="describe">
                                        <Input
                                            size="large"
                                            placeholder="描述"
                                            style={styles.inputCol}
                                        />
                                    </FormBinder>
                                </div>
                            </div>

                            <div style={{ textAlign: 'end', padding: '10px 0' }}>
                                <Button type="normal" onClick={() => this.setState({ visible: false })} style={{ marginRight: '10px' }}>
                                    取 消
                                </Button>
                                <Button type="primary" onClick={() => this.validateFields()} disabled={!this.state.value.name}>
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
        const { apiStore } = this.props.stores;
        return (
            <div className="tree-card-list" style={styles.InterfaceGroupList}>
                <IceContainer>
                    <div style={styles.firstRow}>
                        <span>接口列表</span>
                        <Button type="primary" ref="target" onClick={() => this.setState({ visible: true })}>
                            新增分组
                        </Button>
                        { this.renderOverlay() }
                    </div>
                    <Input
                        hasClear
                        placeholder="搜索接口"
                        onChange={val => this.onSearchChange(val)}
                    />
                    {apiStore.apiGroups.map(this.renderItem)}
                </IceContainer>
            </div>
        );
    }
}

const styles = {
    firstRow: {
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    treeCardItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: '4px',
        height: '40px',
        lineHeight: '40px',
        fontSize: '14px',
        color: '#666',
        cursor: 'pointer',
        padding: '0 10px',
        textDecoration: 'none',
        position: 'relative',
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '0 20px',
    },
    formItem: {
        padding: '10px 0',
    },
};
