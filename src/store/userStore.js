import { Message } from '@alifd/next';
import { observable, action } from 'mobx';
import { login, logout, postUserRegister } from '../api/user';
import { setServerAddress, clearServerAddress } from '../api/index.js';

export default class UserStore {
    @observable token = '';
    @observable profile = {
        name: 'admin',
        department: '技术部',
        avatar: 'https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png',
        userid: 10001,
    };

    constructor() {
        this.fetchToken();
        const serverAddress = localStorage.getItem('serverAddress');
        this.setServerAddress(serverAddress);
    }

    fetchToken() {
        this.token = localStorage.getItem('authToken');
    }

    clearToken() {
        this.token = '';
        localStorage.removeItem('authToken');
    }

    setServerAddress(serverAddress = '') {
        localStorage.setItem('serverAddress', serverAddress);
        setServerAddress(serverAddress);
    }

    clearServerAddress() {
        localStorage.removeItem('serverAddress');
        clearServerAddress();
    }

    @action
    userLogin = async (params) => {
        try {
            const res = await login(params);
            const { status, data } = res;
            if (status === 200) {
                this.token = data.token;
                localStorage.setItem('authToken', data.token);
                Message.success('登录成功');
            } else {
                Message.error('登录失败， 请检查账号密码');
                throw new Error('登录失败， 请检查账号密码');
            }
        } catch (error) {
            Message.error('登录失败，请稍后重试');
            throw new Error('登录失败，请稍后重试');
        }
    }

    @action
    userLogout = async () => {
        try {
            this.clearToken();
            this.clearServerAddress();
            await logout();
            Message.success('已登出');
        } catch (error) {
            throw error;
        }
    }

    @action
    userRegister = async (params) => {
        try {
            const res = await postUserRegister(params);
            if (res.data.status === 200) {
                Message.success('注册成功');
            } else {
                Message.error('注册失败， 请检查账号密码');
                throw new Error('注册失败， 请检查账号密码');
            }
        } catch (error) {
            Message.error('注册失败， 稍后重试');
            throw new Error('注册失败， 稍后重试');
        }
    }
}
