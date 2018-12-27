import { observable, action } from 'mobx';
import { listApiGroups } from '../api/interface';

export default class ApiStore {
    @observable apiGroups = [];

    @action
    async listApiGroups() {
        try {
            const res = await listApiGroups();
            if (res.status === 200) {
                console.log(res.data);
                this.apiGroups = res.data;
            }
        } catch (e) {
            throw e;
        }
    }
}
