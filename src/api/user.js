import request from '../util/request';

export async function getUserProfile() {
    const data = await {
        name: '淘小宝',
        department: '技术部',
        avatar: 'https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png',
        userid: 10001,
    };
    return { data };
}

export async function login(params) {
    const { password, username } = params;
    let data = {};
    if (username === 'admin' && password === 'admin') {
        data = await {
            status: 200,
            statusText: 'ok',
            data: {
                avt: 'https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png',
                logined: '2018-12-25T13:27:17+08:00',
                nick: 'Jason',
                status: 0,
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjEwMDAwLCJ1c2VyX2lkIjoiMS01YTUzMDg5OGJjZDBiIn0.GaszC56XIon_crRpkVRj3wj1xIyexyXc8DmCQR859mA',
                user_id: '1-5a530898bcd0b',
            },
        };
    } else {
        data = await {
            status: 401,
            statusText: 'unauthorized',
            currentAuthority: 'guest',
        };
    }

    return data;
}

export async function postUserRegister() {
    const data = await {
        status: 200,
        statusText: 'ok',
        currentAuthority: 'user',
    };
    return { data };
}

export async function logout() {
    return true;
}
