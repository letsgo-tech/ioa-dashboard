import axios from 'axios';

axios.defaults.timeout = 5000;

// axios.defaults.baseURL = 'http://yapi.kuipmake.com/mock/23';
axios.defaults.baseURL = 'http://kuipmake.com:9992';

export default axios;
