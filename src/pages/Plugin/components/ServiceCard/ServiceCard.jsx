import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import IceContainer from '@icedesign/container';

import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

const { Row, Col } = Grid;

@inject('stores')
@observer
export default class ServiceCard extends Component {
    static displayName = 'ServiceCard';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <Row wrap gutter="20">
                {
                    this.props.plugins instanceof Array &&
                    this.props.plugins.map((item, index) => {
                        return (
                            <Col l="8" key={index}>
                                <IceContainer style={styles.container}>
                                    <div style={styles.body}>
                                        <h4 style={styles.name}>{item.name}</h4>
                                        <p style={styles.desc}>{item.describe}</p>
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
