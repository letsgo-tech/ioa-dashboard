import UserStore from './userStore';
import ApiStore from './apiStore';
import PluginStore from './pluginStore';
import PolicyStore from './policyStore';

const stores = {
    userStore: new UserStore(),
    apiStore: new ApiStore(),
    pluginStore: new PluginStore(),
    policyStore: new PolicyStore(),
};

export default stores;
