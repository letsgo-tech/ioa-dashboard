import { Feedback } from '@icedesign/base';
import { observable, action } from 'mobx';
import { login, postUserLogout, postUserRegister } from '../api/user';

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
    }

    fetchToken() {
        this.token = localStorage.getItem('authToken');
    }

    clearToken() {
        this.token = '';
        localStorage.removeItem('authToken');
    }

    @action
    userLogin = async (params) => {
        try {
            const res = await login(params);
            const { status, data } = res;
            if (status === 200) {
                this.token = data.token;
                localStorage.setItem('authToken', data.token);
                Feedback.toast.success('登录成功');
            } else {
                Feedback.toast.error('登录失败， 请检查账号密码');
                throw new Error('登录失败， 请检查账号密码');
            }
        } catch (error) {
            Feedback.toast.error('登录失败，请稍后重试');
            throw new Error('登录失败，请稍后重试');
        }
    }

    @action
    userLogout = async () => {
        try {
            this.clearToken();
            Feedback.toast.success('已登出');
        } catch (error) {
            throw error;
        }
    }

    @action
    userRegister = async (params) => {
        try {
            const res = await postUserRegister(params);
            if (res.data.status === 200) {
                Feedback.toast.success('注册成功');
            } else {
                Feedback.toast.error('注册失败， 请检查账号密码');
                throw new Error('注册失败， 请检查账号密码');
            }
        } catch (error) {
            Feedback.toast.error('注册失败， 稍后重试');
            throw new Error('注册失败， 稍后重试');
        }
    }
}
