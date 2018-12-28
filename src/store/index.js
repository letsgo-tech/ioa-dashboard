import UserStore from './userStore';
import ApiStore from './apiStore';

const stores = {
    userStore: new UserStore(),
    apiStore: new ApiStore(),
};

export default stores;
