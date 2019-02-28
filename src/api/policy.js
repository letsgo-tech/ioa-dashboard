import request from '../util/request';

export async function listPolicy() {
    const res = await request.get('/policies?order=created_at:asc');
    return res;
}

export async function createPolicy(params) {
    const res = await request.post('/policies', params);
    return res;
}

export async function fetchPolicy(id) {
    const res = await request.get(`/policies/${id}`);
    return res;
}

export async function deletePolicy(id) {
    const res = await request.delete(`/policies/${id}`);
    return res;
}

export async function putPolicy(params) {
    const res = await request.put(`/policies/${params.id}`, params);
    return res;
}
