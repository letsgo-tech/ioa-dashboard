import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import FilterWithSearch from './components/FilterWithSearch';
import ServiceCard from './components/ServiceCard';

import './Plugin.scss';

@inject('stores')
@observer
export default class Plugin extends Component {
    static displayName = 'Plugin';

    constructor(props) {
        super(props);
        this.state = {};
    }

    @computed
    get pluginStore() {
        return this.props.stores.pluginStore;
    }

    componentDidMount() {
        this.pluginStore.listPlugin();
    }

    render() {
        return (
            <div className="plugin-page">
                <FilterWithSearch />
                <ServiceCard />
            </div>
        );
    }
}
