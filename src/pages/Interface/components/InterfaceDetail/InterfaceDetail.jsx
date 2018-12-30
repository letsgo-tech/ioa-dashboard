import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Dialog, Grid, Tag, Select, Table } from '@icedesign/base';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import './InterfaceDetail.scss';

const { Row, Col } = Grid;

/**
 * 渲染详情信息的数据
 */
const dataSource = {
    title: '集盒家居旗舰店双十一活动',
    shopName: '集盒家居旗舰店',
    amount: '1000.00',
    bounty: '200.00',
    orderTime: '2017-10-18 12:20:07',
    deliveryTime: '2017-10-18 12:20:07',
    phone: '15612111213',
    address: '杭州市文一西路',
    status: '进行中',
    remark: '暂无',
    pics: [
        require('./images/clothes.png'),
        require('./images/dress.png'),
        require('./images/dryer.png'),
        require('./images/quilt.png'),
    ],
};

@inject('stores')
@observer
export default class InterfaceDetail extends Component {
    static displayName = 'InterfaceDetail';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    @computed
    get apiStore() {
        return this.props.stores.apiStore;
    }

    componentDidMount() {
        const apiId = this.props.match.params.id;
        this.fetchApi(apiId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            const apiId = nextProps.match.params.id;
            this.fetchApi(apiId);
        }
    }

    async fetchApi(id) {
        try {
            await this.apiStore.fetchApi(id);
        } catch (e) {
            Feedback.toast.error(e.message || '获取接口详情失败');
        }
    }

    render() {
        const { currentApi } = this.apiStore;
        return (
            <div>
                <h2 style={styles.basicDetailTitle}>接口详情</h2>

                <div style={styles.infoColumn}>
                    <h5 style={styles.infoColumnTitle}>基本信息</h5>
                    <Row wrap style={styles.infoItems}>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>接口名称：</span>
                            <span style={styles.infoItemValue}>{currentApi.name}</span>
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>请求方法：</span>
                            <span style={styles.infoItemValue}>
                                <Tag shape="readonly" size="medium" className={`${currentApi.method}-tag`} style={{ color: '#666' }}>{ currentApi.method }</Tag>
                            </span>
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>接口路径：</span>
                            <span style={styles.infoItemValue}>{currentApi.path}</span>
                        </Col>
                        <Col xxs="24" l="12" style={styles.infoItem}>
                            <span style={styles.infoItemLabel}>更新时间：</span>
                            <span style={styles.infoItemValue}>{new Date(currentApi.updatedAt).toLocaleString()}</span>
                        </Col>
                    </Row>
                </div>
                <div style={styles.infoColumn}>
                    <h5 style={styles.infoColumnTitle}>请求参数</h5>
                </div>
            </div>
        );
    }
}

const styles = {
    basicDetailTitle: {
        margin: '10px 0',
        fontSize: '16px',
    },
    infoColumn: {
        marginLeft: '16px',
    },
    infoColumnTitle: {
        margin: '20px 0',
        paddingLeft: '10px',
        borderLeft: '3px solid #3080fe',
    },
    infoItems: {
        padding: 0,
        marginLeft: '25px',
    },
    infoItem: {
        marginBottom: '18px',
        listStyle: 'none',
        fontSize: '14px',
    },
    infoItemLabel: {
        minWidth: '70px',
        color: '#999',
    },
    infoItemValue: {
        color: '#333',
    },
    attachLabel: {
        minWidth: '70px',
        color: '#999',
        float: 'left',
    },
    attachPics: {
        width: '80px',
        height: '80px',
        border: '1px solid #eee',
        marginRight: '10px',
    },
};
