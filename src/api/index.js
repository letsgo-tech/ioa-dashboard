import request from '../util/request';

export function setServerAddress(serverAddress) {
    request.defaults.baseURL = serverAddress;
}

export function clearServerAddress() {
    request.defaults.baseURL = '';
}
