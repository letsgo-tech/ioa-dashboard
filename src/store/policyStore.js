import { observable, action } from 'mobx';
import {
    listPolicy,
    fetchPolicy,
    createPolicy,
    putPolicy,
    deletePolicy,
} from '../api/policy';

export default class PolicyStore {
    @observable policies = [];
    @observable currentPolicy = {};

    @action
    async listPolicy() {
        try {
            const res = await listPolicy();
            if (res.status === 200) {
                this.policies = res.data.data || [];
            }
        } catch (e) {
            throw e;
        }
    }

    @action
    async createPolicy(params) {
        const res = await createPolicy(params);
        if (res.status === 200) {
            this.policies.unshift(res.data);
        } else {
            throw new Error('create failed, please try again later');
        }
    }

    @action
    async fetchPolicy(name) {
        const res = await fetchPolicy(name);
        if (res.status === 200) {
            this.currentPolicy = res.data;
        } else {
            throw new Error('fetch failed, please try again later');
        }
    }

    @action
    async putPolicy(policy) {
        const res = await putPolicy(policy);
        if (res.status === 200) {
            this.currentPolicy = policy;
        } else {
            throw new Error('update failed, please try again later');
        }
    }

    @action
    async deletePolicy(id) {
        const res = await deletePolicy(id);
        if (res.status === 200) {
            for (let i = 0; i < this.policies.length; i++) {
                const policy = this.policies[i];
                if (policy.id === id) {
                    this.policies.splice(i, 1);
                }
            }
        } else {
            throw new Error('delete failed, please try again later');
        }
    }
}
