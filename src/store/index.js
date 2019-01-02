import UserStore from './userStore';
import ApiStore from './apiStore';
import PluginStore from './pluginStore';

const stores = {
    userStore: new UserStore(),
    apiStore: new ApiStore(),
    pluginStore: new PluginStore(),
};

export default stores;
