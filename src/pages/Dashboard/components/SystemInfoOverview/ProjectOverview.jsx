import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid } from '@icedesign/base';
import ContainerTitle from '../ContainerTitle';

const { Row, Col } = Grid;

const mockData = [
  {
    title: '操作系统类型',
    value: 'Linux 64',
  },
  {
    title: 'CPU负载',
    value: '62%',
  },
  {
    title: '系统空闲内存总量 / 内存总量',
    value: '123',
  },
  {
    title: '网络状况',
    value: '390kbps',
  },
  {
    title: 'IOA版本',
    value: 'v1.0.1',
  },
];

export default class Overview extends Component {
  static displayName = 'Overview';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ContainerTitle title="系统信息" />
        <IceContainer style={styles.container}>
          <Row>
            <Col l="4">
              <div style={styles.item}>
                <img src={require('./images/box.svg')} alt="" />
              </div>
            </Col>
            {mockData.map((item, index) => {
              return (
                <Col l="4" key={index}>
                  <div style={styles.item}>
                    <p style={styles.itemTitle}>{item.title}</p>
                    <p style={styles.itemValue}>{item.value}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  item: {
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    color: '#697b8c',
    fontSize: '14px',
  },
  itemValue: {
    color: '#314659',
    fontSize: '36px',
    marginTop: '10px',
  },
};
