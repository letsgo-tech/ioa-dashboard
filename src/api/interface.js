import request from '../util/request';

export async function listApisWithTag() {
    const res = await request.get('/apisWithTag');
    return res;
}

export async function listApi() {
    const res = await request.get('/apis?order=created_at:desc');
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

export async function putApi(api) {
    const res = await request.put(`/apis/${api.id}`, api);
    return res;
}
