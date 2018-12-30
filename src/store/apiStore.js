import { observable, action } from 'mobx';
import {
    listApiGroups,
    fetchApiGroup,
    createApiGroup,
    deleteApiGroup,
    createApi,
    fetchApi,
    deleteApi,
    patchApi,
} from '../api/interface';

export default class ApiStore {
    @observable apiGroups = [];
    @observable currentGroup = {};
    @observable currentApi = {};

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

    @action
    async fetchApi(id) {
        const res = await fetchApi(id);
        if (res.status === 200) {
            this.currentApi = res.data;
        } else {
            throw new Error('获取接口详情失败， 请稍后重试');
        }
    }

    @action
    async deleteApi(groupId, apiId) {
        const res = await deleteApi(apiId);
        if (res.status === 200) {
            for (let i = 0; i < this.apiGroups.length; i++) {
                const group = this.apiGroups[i];
                if (group.id === groupId) {
                    this.removeApiFromGroup(group, apiId);
                }
            }
        } else {
            throw new Error('删除失败， 请稍后重试');
        }
    }

    @action
    async changeGroup(apiId, cgId, tgId) {
        const res = await patchApi(apiId, { apiGroupId: tgId });
        if (res.status === 200) {
            let cg;
            let tg;
            for (let i = 0; i < this.apiGroups.length; i++) {
                const group = this.apiGroups[i];
                if (group.id === cgId) cg = group;
                if (group.id === tgId) tg = group;
            }

            tg.apis.push(this.removeApiFromGroup(cg, apiId));
        } else {
            throw new Error('操作失败， 请稍后重试');
        }
    }

    removeApiFromGroup(group, apiId) {
        if (group.apis instanceof Array) {
            for (let i = 0; i < group.apis.length; i++) {
                if (group.apis[i].id === apiId) {
                    return group.apis.splice(i, 1)[0];
                }
            }
        }
    }
}
