import { observable, action, computed } from 'mobx';
import {
    listApisWithTag,
    listApi,
    createApi,
    fetchApi,
    deleteApi,
    putApi,
} from '../api/interface';

export default class ApiStore {
    @observable apiGroups = [];
    @observable tags = {};
    @observable currentGroup = {};
    @observable apis = [];
    @observable currentApi = {};


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
            throw new Error('fetch api failed, please try again later');
        }
    }

    @action
    async listApi() {
        const res = await listApi();
        if (res.status === 200) {
            this.apis = res.data.data;
        } else {
            throw new Error('list api failed, please try again later');
        }
    }

    @action
    async createApi(params) {
        const res = await createApi(params);
        if (res.status === 200) {
            this.apis.unshift(res.data);
        } else {
            throw new Error('create failed, please try again later');
        }
    }

    @action
    async fetchApi(id) {
        const res = await fetchApi(id);
        if (res.status === 200) {
            this.currentApi = res.data;
        } else {
            throw new Error('fetch api filed');
        }
    }

    @action
    async putApi(api) {
        const res = await putApi(api);
        if (res.status === 200) {
            this.fetchApi(api.id);
        } else {
            throw new Error('update failed, please try again later');
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
            throw new Error('delete failed, please try again later');
        }
    }
}
