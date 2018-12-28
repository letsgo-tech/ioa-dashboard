import React, { Component } from 'react';
import { Grid } from '@icedesign/base';
import './AllInterface.scss';

const { Row, Col } = Grid;

export default class AllInterface extends Component {
    static displayName = 'AllInterface';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div> all </div>
        );
    }
}
