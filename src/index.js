import React from 'react';
import ReactDOM from 'react-dom';
// 载入默认全局样式 normalize 、.clearfix 和一些 mixin 方法等
import '@alifd/next/reset.scss';

import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';
import { createHashHistory } from 'history';

import './index.scss';
import router from './router';
import stores from './store';

const hashHistory = createHashHistory();
const routerStore = new RouterStore();

const history = syncHistoryWithStore(hashHistory, routerStore);

const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
    throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

ReactDOM.render(
    <Provider stores={stores}>
        <Router history={history}>
            { router() }
        </Router>
    </Provider>,
    ICE_CONTAINER
);
