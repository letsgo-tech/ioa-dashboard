import { observable, action, computed } from 'mobx';
import {
    listPlugin,
    fetchPlugin,
    fetchConfigTpl,
} from '../api/plugin';

export default class PluginStore {
    @observable plugins = [];
    @observable currentPlugin = {};

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
    async fetchPlugin(name) {
        const res = await fetchPlugin(name);
        if (res.status === 200) {
            this.currentPlugin = res.data;
        } else {
            throw new Error('获取插件详情失败， 请稍后重试');
        }
    }

    @action
    async fetchConfigTpl(name) {
        const res = await fetchConfigTpl(name);
        if (res.status === 200) {
            this.currentConfigTpls = res.data || [];
        } else {
            throw new Error('获取插件配置项失败， 请稍后重试');
        }
    }
}
