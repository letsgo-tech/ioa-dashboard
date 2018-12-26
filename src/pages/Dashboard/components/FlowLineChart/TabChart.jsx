import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import SeriesLine from './SeriesLine';
import ContainerTitle from '../ContainerTitle';
import { Grid, Table, Progress } from '@icedesign/base';

const { Row, Col } = Grid;


export default class TabChart extends Component {
  static displayName = 'TabChart';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }


  handleChange = (key) => {
    console.log('change', key);
  };

  render() {
    const activePages = [
      { id: 1, page: '/getting', amount: '2,80,489', percent: 90 },
      { id: 2, page: '/home', amount: '1,98,956', percent: 70 },
      { id: 3, page: '/pricing', amount: '1,90,257', percent: 60 },
      { id: 4, page: '/about', amount: '1,80,745', percent: 50 },
      { id: 5, page: '/blog', amount: '1,24,693', percent: 40 },
      { id: 6, page: '/support', amount: '8,489', percent: 35 },
      { id: 7, page: '/team', amount: '5,233', percent: 30 },
      { id: 8, page: '/faq', amount: '1,688', percent: 20 },
    ];
    return (
      <div className="tab-chart" style={styles.container}>
        <ContainerTitle title="API 统计" />
        <IceContainer style={styles.card}>
          <Row wrap gutter={20}>
            <Col l="18">
              <SeriesLine />
            </Col>
            <Col l="6">

              <IceContainer title="API 访问量排名">
                <Table
                  dataSource={activePages}
                  hasBorder={false}
                  hasHeader={false}
                  style={{ width: '100%', height: '341px' }}
                >
                  <Table.Column title="ID" dataIndex="id" width="5%" />
                  <Table.Column title="页面" dataIndex="page" />
                  <Table.Column title="销售数量" dataIndex="amount" />
                  <Table.Column
                    title="销售占比"
                    dataIndex="page"
                    cell={(value, index, record) => (
                      <Progress percent={record.percent} showInfo={false} />
                    )}
                  />
                </Table>
              </IceContainer>
            </Col>
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  container: {
    marginBottom: '20px',
  },
  card: {
    padding: '0 20px',
  },
};
