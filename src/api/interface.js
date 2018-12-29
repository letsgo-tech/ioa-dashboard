import request from '../util/request';

export async function listApiGroups() {
    const res = await request.get('/apiGroups?order=created_at:asc');
    return res;
}

export async function createApiGroup(params) {
    const res = await request.post('/apiGroups', params);
    return res;
}

export async function fetchApiGroup(id) {
    const res = await request.get(`/apiGroups/${id}`);
    return res;
}

export async function deleteApiGroup(id) {
    const res = await request.delete(`/apiGroups/${id}`);
    return res;
}

export async function patchApiGroup(id, params) {
    const res = await request.patch(`/apiGroups/${id}`, params);
    return res;
}

export async function putApiGroup(id, params) {
    const res = await request.put(`/apiGroups/${id}`, params);
    return res;
}

export async function createApi(params) {
    const res = await request.post('/apis', params);
    return res;
}
