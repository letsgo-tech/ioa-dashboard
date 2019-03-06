/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Input, Menu } from '@alifd/next';
import IceContainer from '@icedesign/container';
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
                                                    to={`/interface/${api.id}`}
                                                >
                                                    <span>
                                                        {api.name}
                                                    </span>
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

    render() {
        return (
            <div className="tree-card-list" style={styles.InterfaceTagList}>
                <IceContainer>
                    <div style={styles.firstRow}>
                        <span>Tag List</span>
                    </div>
                    <Input
                        style={{ width: '100%' }}
                        hasClear={true}
                        placeholder="search tag/interface"
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
