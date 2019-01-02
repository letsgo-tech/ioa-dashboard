import React, { Component } from 'react';
import { Grid, Icon, Switch } from '@icedesign/base';
import IceContainer from '@icedesign/container';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

const { Row, Col } = Grid;

// MOCK 数据，实际业务按需进行替换
const getData = () => {
    return Array.from({ length: 6 }).map(() => {
        return {
            name: '服务名称',
            desc: '这里是一段相关的服务简介，介绍产品的功能、特点',
            tag: '精选',
        };
    });
};


@inject('stores')
@observer
export default class ServiceCard extends Component {
    static displayName = 'ServiceCard';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = { updating: false };
    }

    @computed
    get pluginStore() {
        return this.props.stores.pluginStore;
    }

    onStatusChange = async (val, item) => {
        let status = 0;
        if (val) {
            status = 1;
        }
        this.setState({ updating: true });
        await this.pluginStore.changePluginStatus(item, status);
        this.setState({ updating: false });
    }

    render() {
        const { filteredPlugin } = this.pluginStore;
        return (
            <Row wrap gutter="20">
                {filteredPlugin.map((item, index) => {
                    return (
                        <Col l="8" key={index}>
                            <IceContainer style={styles.container}>
                                <div style={styles.body}>
                                    <h4 style={styles.name}>{item.name}</h4>
                                    <p style={styles.desc}>{item.describe}</p>
                                    <div style={styles.tag}>{new Date(item.updatedAt).toLocaleString()}</div>
                                </div>
                                <div style={styles.footer}>
                                    <a href="#" style={{ ...styles.link, ...styles.line }}>
                                        <Icon type="office" size="small" style={styles.icon} />{' '}
                                        文档帮助 (建设中)
                                    </a>
                                    <span style={styles.link}>
                                        <Switch
                                            checked={String(item.status) === '1'}
                                            onChange={val => this.onStatusChange(val, item)}
                                            disabled={this.state.updating}
                                        />
                                        {String(item.status) === '0' ? '已禁用' : '已启用'}
                                    </span>
                                </div>
                            </IceContainer>
                        </Col>
                    );
                })}
            </Row>
        );
    }
}

const styles = {
    container: {
        padding: '0',
    },
    body: {
        padding: '20px',
        height: '120px',
        position: 'relative',
        borderBottom: '1px solid #f0f0f0',
    },
    name: {
        margin: '0',
        padding: '0',
        height: '28px',
        lineHeight: '28px',
        fontSize: '20px',
        color: '#0d1a26',
    },
    desc: {
        fontSize: '14px',
        color: '#697b8c',
        margin: '12px 0',
    },
    tag: {
        background: '#fff0f6',
        border: '1px solid #ffadd2',
        color: '#eb2f96',
        position: 'absolute',
        right: '20px',
        top: '20px',
        padding: '4px 12px',
        textAlign: 'center',
        borderRadius: '50px',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '56px',
        color: '#314659',
        cursor: 'pointer',
        textDecoration: 'none',
        width: '50%',
    },
    line: {
        borderRight: '1px solid #f0f0f0',
    },
    icon: {
        marginRight: '5px',
    },
};
