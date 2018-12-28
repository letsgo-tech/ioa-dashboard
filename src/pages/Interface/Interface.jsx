import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import IceContainer from '@icedesign/container';
import InterfaceGroupList from './components/InterfaceGroupList';
import AllInterface from './components/AllInterface';
import InterfaceGroupDetail from './components/InterfaceGroupDetail';
import InterfaceDetail from './components/InterfaceDetail';
import './Interface.scss';

@withRouter
export default class Interface extends Component {
    static displayName = 'Interface';

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="interface-page">
                <InterfaceGroupList />
                <IceContainer style={{ flex: 1 }}>
                    <Switch>
                        <Route path="/interface" exact component={AllInterface} />
                        <Route path="/interface/group/:id" exact component={InterfaceGroupDetail} />
                        <Route path="/interface/api/:id" exact component={InterfaceDetail} />
                    </Switch>
                </IceContainer>
            </div>
        );
    }
}
