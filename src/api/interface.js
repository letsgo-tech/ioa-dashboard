import request from '../util/request';

export async function listApiGroup() {
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

export async function listApi() {
    const res = await request.get('/apis');
    return res;
}

export async function createApi(params) {
    const res = await request.post('/apis', params);
    return res;
}

export async function fetchApi(id) {
    const res = await request.get(`/apis/${id}`);
    return res;
}

export async function deleteApi(id) {
    const res = await request.delete(`/apis/${id}`);
    return res;
}

export async function patchApi(id, params) {
    const res = await request.patch(`/apis/${id}`, params);
    return res;
}

export async function putApi(api) {
    const res = await request.put(`/apis/${api.id}`, api);
    return res;
}
