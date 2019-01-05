import { observable, action, computed } from 'mobx';
import {
    listPlugin,
    fetchPlugin,
    createPlugin,
    deletePlugin,
    patchPlugin,
    putPlugin,
    fetchConfigTpl,
} from '../api/plugin';

export default class PluginStore {
    @observable plugins = [];
    @observable currentPlugin = {};
    @observable searchStr = '';
    @observable statusFlag = 'all';
    @observable currentConfigTpls = [];

    @action
    async listPlugin() {
        try {
            const res = await listPlugin();
            if (res.status === 200) {
                this.plugins = res.data.data || [];
            }
        } catch (e) {
            throw e;
        }
    }

    @action
    async fetchPlugin(id) {
        const res = await fetchPlugin(id);
        if (res.status === 200) {
            this.currentPlugin = res.data;
        } else {
            throw new Error('获取插件详情失败， 请稍后重试');
        }
    }

    @action
    async fetchConfigTpl(id) {
        const res = await fetchConfigTpl(id);
        if (res.status === 200) {
            this.currentConfigTpls = res.data || [];
        } else {
            throw new Error('获取插件配置项失败， 请稍后重试');
        }
    }

    @action
    async changePluginStatus(item, status) {
        const { id } = item;
        try {
            const res = await putPlugin(id, Object.assign({}, item, { status }));
            if (res.status === 200) {
                for (let i = 0; i < this.plugins.length; i++) {
                    if (this.plugins[i].id === id) {
                        this.plugins[i].status = status;
                        return;
                    }
                }
            }
        } catch (e) {
            throw e;
        }
    }

    @action
    setSearchStr(str = '') {
        this.searchStr = str;
    }

    @action
    setStatusFlag(status = 'all') {
        this.statusFlag = status;
    }

    @computed
    get filteredPlugin() {
        if (this.searchStr === '' && this.statusFlag === 'all') {
            return this.plugins;
        }

        if (this.searchStr !== '' && this.statusFlag !== 'all') {
            return this.plugins.filter(item => {
                return (item.name.indexOf(this.searchStr) > -1) && (String(item.status) === this.statusFlag);
            });
        }

        return this.plugins.filter(item => {
            if (this.searchStr === '') {
                return String(item.status) === this.statusFlag;
            }

            return item.name.indexOf(this.searchStr) > -1;
        });
    }
}