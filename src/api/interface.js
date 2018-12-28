import request from '../util/request';

export async function listApiGroups() {
    const res = await request.get('/apiGroups');
    return res;
}

export async function createApiGroups() {
    const res = await request.post('/apiGroups');
    return res;
}

export async function getApiGroups(id) {
    const res = await request.get(`/apiGroups/${id}`);
    return res;
}

export async function deleteApiGroups(id) {
    const res = await request.delete(`/apiGroups/${id}`);
    return res;
}

export async function patchApiGroups(id, params) {
    const res = await request.patch(`/apiGroups/${id}`, params);
    return res;
}

export async function putApiGroups(id, params) {
    const res = await request.put(`/apiGroups/${id}`, params);
    return res;
}