import React, { Component } from 'react';
import { Input } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import FoundationSymbol from '@icedesign/foundation-symbol';
import { inject, observer } from 'mobx-react'; 
import './TreeCardList.scss';


const dataSource = [
    {
        createdAt: 'dolore consectetur exercita',
        deletedAt: 'ut Ut',
        describe: 'in pariatur labore dolore',
        id: 'elit',
        isDefault: true,
        name: 'order',
        plugins: 'est aute dolore incididunt',
        policies: 'proident dolor cupidatat',
        updatedAt: 'officia proident velit ad',
        apis: [
            {
                name: 'culpa irure sit dolore do',
            },
            {
                name: 'culpa irure sit dolore do',
            },
            {
                name: 'culpa irure sit dolore do',
            },
        ],
    },
    {
        createdAt: 'dolore consectetur exercita',
        deletedAt: 'ut Ut',
        describe: 'in pariatur labore dolore',
        id: 'laborum',
        isDefault: true,
        name: 'other',
        plugins: 'est aute dolore incididunt',
        policies: 'proident dolor cupidatat',
        updatedAt: 'officia proident velit ad',
        apis: [
            {
                name: 'culpa irure sit dolore do',
            },
            {
                name: 'culpa irure sit dolore do',
            },
            {
                name: 'culpa irure sit dolore do',
            },
        ],
    },
];

@inject('stores')
@observer
export default class TreeCardList extends Component {
    static displayName = 'TreeCardList';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    // ICE: React Component 的生命周期

    componentWillMount() { }

    componentDidMount() {
        const { apiStore } = this.props.stores;
        apiStore.listApiGroups();
    }

    componentWillUnmount() { }

    renderItem = (item, idx) => {
        const openState = this.state[`item-${idx}`];
        return (
            <div key={idx}>
                <a
                    style={styles.treeCardItem}
                    className="tree-card-item"
                    onClick={() => this.setState({ [`item-${idx}`]: !openState })}
                >
                    <span style={styles.tab}>{item.name}</span>
                    <span className="operate-btns">
                        <span style={{ marginRight: '10px' }}>
                            <FoundationSymbol type="edit2" size="small" />
                        </span>
                        <span>
                            <FoundationSymbol type="delete" size="small" />
                        </span>
                    </span>
                </a>
                {
                    openState && item.apis ?
                        <ul className="api-item-list">
                            {item.apis.map((api, index) => {
                                return (
                                    <li
                                        className="api-item"
                                        key={index}
                                    >
                                        {api.name}
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

    onSearchChange(value) {
        console.log(value);
    }

    render() {
        const { apiStore } = this.props.stores;
        return (
            <div className="tree-card-list" style={styles.treeCardList}>
                <IceContainer>
                    <div style={styles.firstRow}>
                        <span>接口列表</span>
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
};
