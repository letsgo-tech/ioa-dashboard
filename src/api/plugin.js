import request from '../util/request';

export async function listPluginsWithTag() {
    const res = await request.get('/pluginsWithTag?order=created_at:asc');
    return res;
}

export async function listPlugins() {
    const res = await request.get('/plugins?order=created_at:asc');
    return res;
}

export async function createPlugin(params) {
    const res = await request.post('/plugins', params);
    return res;
}

export async function fetchPlugin(id) {
    const res = await request.get(`/plugins/${id}`);
    return res;
}

export async function deletePlugin(id) {
    const res = await request.delete(`/plugins/${id}`);
    return res;
}

export async function putPlugin(id, params) {
    const res = await request.put(`/plugins/${id}`, params);
    return res;
}

export async function fetchConfigTpl(id) {
    const res = await request.get(`/plugins/${id}/configTpl`);
    return res;
}
