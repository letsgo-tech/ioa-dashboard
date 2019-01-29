import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Grid } from '@alifd/next';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import './FilterWithSearch.scss';

const { Row, Col } = Grid;

@inject('stores')
@observer
export default class FilterWithSearch extends Component {
    static displayName = 'FilterWithSearch';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    @computed
    get pluginStore() {
        return this.props.stores.pluginStore;
    }

    selectFilter = (type) => {
        this.pluginStore.setStatusFlag(type);
    };

    handleSearch = (val) => {
        this.pluginStore.setSearchStr(val);
    };

    render() {
        return (
            <div className="filter-with-search" style={styles.filterWithSearch}>
                <IceContainer
                    className="filter-with-search-container"
                    style={styles.filterWithSearchContainer}
                >
                    <Row wrap justify="space-between" style={styles.row}>
                        <Col xxs={24} s={8} style={styles.filterContainer}>
                            <span
                                className={`filter-item ${this.pluginStore.statusFlag === 'all' && 'selected'}`}
                                style={styles.filterItem}
                                onClick={this.selectFilter.bind(this, 'all')}
                            >
                                全部
                            </span>
                            <span
                                className={`filter-item ${this.pluginStore.statusFlag === '1' && 'selected'}`}
                                style={styles.filterItem}
                                onClick={this.selectFilter.bind(this, '1')}
                            >
                                已启用
                            </span>
                            <span
                                className={`filter-item ${this.pluginStore.statusFlag === '0' && 'selected'}`}
                                style={styles.filterItem}
                                onClick={this.selectFilter.bind(this, '0')}
                            >
                                禁用
                            </span>
                        </Col>
                        <Col xxs={24} s={16} style={styles.searchWrapper}>
                            <Input
                                value={this.pluginStore.searchStr}
                                onChange={val => this.handleSearch(val)}
                                placeholder="搜索"
                            />
                        </Col>
                    </Row>
                </IceContainer>
            </div>
        );
    }
}

const styles = {
    row: {
        alignItems: 'center',
    },
    filterContainer: {
        lineHeight: '32px',
    },
    filterItem: {
        height: '20px',
        padding: '0 20px',
        color: '#333',
        fontSize: '14px',
        cursor: 'pointer',
        borderRight: '1px solid #D8D8D8',
    },
    searchWrapper: {
        textAlign: 'right',
        margin: '10px 0',
    },
};
