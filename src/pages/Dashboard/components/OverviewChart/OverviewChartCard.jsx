import React, { Component } from 'react';
import { Grid, Progress } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import Head from './Head';
import ColumnChart from './ColumnChart';
import ContainerTitle from './ContainerTitle';

const { Row, Col } = Grid;

export default class OverviewChartCard extends Component {
  static displayName = 'OverviewChartCard';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ContainerTitle title="API 今日统计" />
        <Row wrap gutter={20}>
          <Col xxs="24" l="6">
            <IceContainer>
              <Head title="总访问量" content="数据说明" total="126,560" />
              <ColumnChart type="area" />
            </IceContainer>
          </Col>
          <Col xxs="24" l="6">
            <IceContainer>
              <Head title="处理中" content="数据说明" total="6,238" />
              <ColumnChart type="area" />
            </IceContainer>
          </Col>
          <Col xxs="24" l="6">
            <IceContainer>
              <Head title="成功数量" content="数据说明" total="9,653" />
              <ColumnChart type="area" />
            </IceContainer>
          </Col>
          <Col xxs="24" l="6">
            <IceContainer>
              <Head title="失败数量" content="数据说明" total="51%" />
              <ColumnChart type="area" />
            </IceContainer>
          </Col>
        </Row>
      </div>
    );
  }
}

const styles = {
  footer: {
    height: '30px',
    paddingTop: '10px',
    marginTop: '10px',
    borderTop: '1px solid #e8e8e8',
  },
};
