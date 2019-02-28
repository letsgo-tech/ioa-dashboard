import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import IceContainer from '@icedesign/container';

import PolicyTip from './components/PolicyTip';
import AllPolicy from './components/AllPolicy';
import PolicyDetail from './components/PolicyDetail';

import './index.scss';

export default class Policy extends Component {
    static displayName = 'Policy';

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="policy-page">
                {/* <PolicyTip /> */}
                <IceContainer style={{ flex: 1 }}>
                    <Switch>
                        <Route path="/policy" exact component={AllPolicy} />
                        <Route path="/policy/:id" exact component={PolicyDetail} />
                    </Switch>
                </IceContainer>
            </div>
        );
    }
}
