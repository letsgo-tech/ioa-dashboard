/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Message, Menu, Dialog } from '@alifd/next';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import IceContainer from '@icedesign/container';
import FoundationSymbol from '@icedesign/foundation-symbol';
import { Link } from 'react-router-dom';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import './InterfaceTagList.scss';

const { SubMenu, Item } = Menu;

@inject('stores')
@observer
export default class InterfaceTagList extends Component {
    static displayName = 'InterfaceTagList';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            searchStr: '',
            visible: false,
            isCreating: false,
            value: {
                name: '',
                describe: '',
            },
        };
    }

    componentWillMount() { }

    async componentDidMount() {
        const { apiStore } = this.props.stores;
        await apiStore.listApisWithTag();
    }

    componentWillUnmount() { }

    onSearchChange(value) {
        this.setState({ searchStr: value });
    }

    @computed
    get apiStore() {
        return this.props.stores.apiStore;
    }

    @computed
    get getTags() {
        const { tags } = this.props.stores.apiStore;
        const { searchStr } = this.state;
        if (!searchStr) return tags;
        const t = {};
        Object.keys(tags).forEach(key => {
            const item = tags[key];
            if (key.indexOf(searchStr) > -1) {
                return t[key] = item;
            }

            if (!(item instanceof Array)) return;

            const apis = item.filter(api => {
                return api.name.indexOf(searchStr) > -1;
            });

            if (apis.length) return t[key] = apis;
        });

        return t;
    }

    deleteApiGroup = async (id) => {
        try {
            await this.props.stores.apiStore.deleteApiGroup(id);
            Message.success('删除分组成功');
            this.props.onDeleteGroup();
        } catch (e) {
            Message.error('删除分组失败');
        }
    }

    deleteApi = async (groupId, apiId) => {
        try {
            await this.props.stores.apiStore.deleteApi(groupId, apiId);
            Message.success('删除接口成功');
            this.props.onDeleteApi(groupId);
        } catch (e) {
            Message.error('删除接口失败');
        }
    }

    renderTags = () => {
        const { id: currentApiId } = this.apiStore.currentApi;

        return (
            <Menu className="my-menu" style={{ border: 0 }}>
                {
                    Object.keys(this.getTags).map((key, index) => {
                        const apis = this.getTags[key];
                        return (
                            <SubMenu key={index} label={<span style={{ fontSize: '14px' }}>{key}</span>}>
                                {
                                    apis.map((api, idx) => {
                                        return (
                                            <Item key={`${index}-${idx}`}>
                                                <Link
                                                    className={`api-item ${currentApiId === api.id && 'selected'}`}
                                                    key={index}
                                                    to={`/interface/api/${api.id}`}
                                                >
                                                    <span>
                                                        {api.name}
                                                    </span>
                                                    {/* <span className="operate-btns" style={{ display: 'inline-block', width: '32px' }}>
                                                        <span onClick={() => {
                                                            Dialog.confirm({
                                                                title: `是否删除该接口：${api.name}`,
                                                                content: '删除后将无法恢复',
                                                                onOk: () => this.deleteApi(item.id, api.id),
                                                            });
                                                        }}
                                                        >
                                                            <FoundationSymbol type="delete" size="small" />
                                                        </span>
                                                    </span> */}
                                                </Link>
                                            </Item>
                                        );
                                    })
                                }
                            </SubMenu>
                        );
                    })
                }
            </Menu>
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
                    Message.success('创建分组成功');
                    this.setState({ value: { name: '', describe: '' } });
                } catch (error) {
                    this.setState({ isCreating: false });
                    Message.error('创建失败， 请稍后重试');
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
                        <h4 style={{ paddingTop: '10px' }}>新增Tag</h4>
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
        return (
            <div className="tree-card-list" style={styles.InterfaceTagList}>
                <IceContainer>
                    <div style={styles.firstRow}>
                        <span>标签列表</span>
                        {/* <Button type="primary" ref="target" size="small" onClick={() => this.setState({ visible: true })}>
                            新增Tag
                        </Button>
                        { this.renderOverlay() } */}
                    </div>
                    <Input
                        style={{ width: '100%' }}
                        hasClear={true}
                        placeholder="搜索标签/接口"
                        onChange={val => this.onSearchChange(val)}
                    />
                    {this.renderTags()}
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
