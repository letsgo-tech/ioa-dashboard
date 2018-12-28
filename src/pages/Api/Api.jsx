import React, { Component } from 'react';
import TreeCardList from './components/TreeCardList';
import ApiDetail from './components/ApiDetail';
import './Api.scss';

export default class Api extends Component {
    static displayName = 'Api';

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="api-page">
                <TreeCardList />
                <ApiDetail />
            </div>
        );
    }
}
