import axios from 'axios';

axios.defaults.timeout = 5000;

axios.defaults.baseURL = 'http://yapi.kuipmake.com/mock/23';

export default axios;
