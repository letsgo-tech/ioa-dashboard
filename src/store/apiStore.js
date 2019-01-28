import { observable, action, computed } from 'mobx';
import {
    listApisWithTag,
    listApi,
    createApi,
    fetchApi,
    deleteApi,
    patchApi,
    putApi,
} from '../api/interface';

export default class ApiStore {
    @observable apiGroups = [];
    @observable tags = {};
    @observable currentGroup = {};
    @observable apis = [];
    @observable currentApi = {};

    @computed
    get params() {
        return this.currentApi.params || [];
    }

    @computed
    get targets() {
        return this.currentApi.targets || [];
    }

    @action
    async listApisWithTag() {
        const res = await listApisWithTag();
        if (res.status === 200) {
            console.log(res);
            this.tags = res.data.data;
        } else {
            throw new Error('获取api失败， 请稍后重试');
        }
    }

    @action
    async listApi() {
        const res = await listApi();
        if (res.status === 200) {
            this.apis = res.data.data;
        } else {
            throw new Error('获取api失败， 请稍后重试');
        }
    }

    @action
    async createApi(params) {
        const res = await createApi(params);
        if (res.status === 200) {
            this.apis.unshift(res.data);
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
    async putApi(api) {
        const res = await putApi(api);
        if (res.status === 200) {
            this.currentApi = api;
        } else {
            throw new Error('更新接口失败， 请稍后重试');
        }
    }

    @action
    async deleteApiById(id) {
        const res = await deleteApi(id);
        if (res.status === 200) {
            for (let i = 0; i < this.apis.length; i++) {
                const api = this.apis[i];
                if (api.id === id) {
                    this.apis.splice(i, 1);
                }
            }
        } else {
            throw new Error('删除失败， 请稍后重试');
        }
    }

    // deprecated

    // delete api from apisGroup list, could be removed soon
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
    async patchApi(id, params) {
        const res = await patchApi(id, params);
        if (res.status === 200) {
            this.currentApi = Object.assign({}, this.currentApi, params);
        } else {
            throw new Error('更新接口详情失败， 请稍后重试');
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

            this.removeApiFromGroup(this.currentGroup, apiId);
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

    @action
    async createTarget(param) {
        const res = await createTarget(param);
        if (res.status === 200) {
            this.targets.push(res.data);
        } else {
            throw new Error('创建转发目标失败， 请稍后重试');
        }
    }

    @action
    async patchTarget(id, param) {
        const res = await patchTarget(id, param);
        if (res.status === 200) {
            for (let i = 0; i < this.targets.length; i++) {
                if (this.targets[i].id === id) {
                    this.targets[i] = Object.assign({}, this.targets[i], param);
                }
            }
        } else {
            throw new Error('更新转发目标失败， 请稍后重试');
        }
    }

    @action
    async deleteTarget(id) {
        const res = await deleteTarget(id);
        if (res.status === 200) {
            for (let i = 0; i < this.targets.length; i++) {
                if (this.targets[i].id === id) {
                    this.targets.splice(i, 1);
                }
            }
        } else {
            throw new Error('删除转发目标失败， 请稍后重试');
        }
    }
}
