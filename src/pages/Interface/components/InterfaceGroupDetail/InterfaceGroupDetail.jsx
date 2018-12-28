import React, { Component } from 'react';
import { Button, Input, Overlay, Loading, Feedback, Dialog } from '@icedesign/base';
import { inject, observer } from 'mobx-react';
import './InterfaceGroupDetail.scss';

@inject('stores')
@observer
export default class InterfaceGroupDetail extends Component {
    static displayName = 'InterfaceGroupDetail';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const groupId = this.props.match.params.id;
        this.fetchApiGroup(groupId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            const groupId = nextProps.match.params.id;
            this.fetchApiGroup(groupId);
        }
    }

    async fetchApiGroup(id) {
        try {
            await this.props.stores.apiStore.fetchApiGroup(id);
        } catch (e) {
            Feedback.toast.error(e || '获取分组失败');
        }
    }

    render() {
        const { currentGroup } = this.props.stores.apiStore;
        return (
            <div> { currentGroup.name } </div>
        );
    }
}
