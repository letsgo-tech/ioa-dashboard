import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Tag } from '@alifd/next';
import ServiceCard from './components/ServiceCard';

import './Plugin.scss';

const { Group: TagGroup, Selectable: SelectableTag } = Tag;

@inject('stores')
@observer
export default class Plugin extends Component {
    static displayName = 'Plugin';

    constructor(props) {
        super(props);
        this.state = {
            currentTag: 'All',
        };
    }

    @computed
    get pluginStore() {
        return this.props.stores.pluginStore;
    }

    async componentDidMount() {
        await this.pluginStore.listPlugin();
        await this.pluginStore.listPluginsWithTag();
    }

    @computed
    get plugins() {
        const { allPlugins, tagPlugins } = this.pluginStore;
        return Object.assign({}, { All: allPlugins }, tagPlugins);
    }

    render() {
        return (
            <div className="plugin-page">
                <TagGroup style={{ padding: '20px' }}>
                    {
                        Object.keys(this.plugins).map((key, index) => {
                            return (
                                <SelectableTag
                                    type="primary"
                                    checked={key === this.state.currentTag}
                                    key={index}
                                    onChange={() => this.setState({ currentTag: key })}
                                >
                                    {key}
                                </SelectableTag>
                            );
                        })
                    }
                </TagGroup>
                <ServiceCard plugins={this.plugins[this.state.currentTag]} />
            </div>
        );
    }
}
