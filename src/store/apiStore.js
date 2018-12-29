import { observable, action } from 'mobx';
import {
    listApiGroups,
    fetchApiGroup,
    createApiGroup,
    deleteApiGroup,
    createApi,
} from '../api/interface';

export default class ApiStore {
    @observable apiGroups = [];
    @observable currentGroup = {};

    @action
    async listApiGroups() {
        try {
            const res = await listApiGroups();
            if (res.status === 200) {
                console.log(res.data);
                this.apiGroups = res.data.data || [];
                //this.apiGroups = res.data || [];
            }
        } catch (e) {
            throw e;
        }
    }

    @action
    async fetchApiGroup(id) {
        const res = await fetchApiGroup(id);
        if (res.status === 200) {
            this.currentGroup = res.data;
        } else {
            throw new Error('获取分组详情失败， 请稍后重试');
        }
    }

    @action
    async createApiGroup(params) {
        const res = await createApiGroup(params);
        if (res.status === 200) {
            this.apiGroups.push(res.data);
        } else {
            throw new Error('创建失败， 请稍后重试');
        }
    }

    @action
    async deleteApiGroup(id) {
        const res = await deleteApiGroup(id);
        if (res.status === 200) {
            for (let i = 0; i < this.apiGroups.length; i++) {
                if (this.apiGroups[i].id === id) {
                    this.apiGroups.splice(i, 1);
                    return;
                }
            }
        } else {
            throw new Error('删除失败， 请稍后重试');
        }
    }

    @action
    async createApi(params) {
        const res = await createApi(params);
        if (res.status === 200) {
            if (!(this.currentGroup.apis instanceof Array)) {
                this.currentGroup.apis = [];
            }
            this.currentGroup.apis.push(res.data);
            for (let i = 0; i < this.apiGroups.length; i++) {
                if (this.apiGroups[i].id === this.currentGroup.id) {
                    this.apiGroups[i].apis.push(res.data);
                    return;
                }
            }
        } else {
            throw new Error('创建接口失败， 请稍后重试');
        }
    }
}
