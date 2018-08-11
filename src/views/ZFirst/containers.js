import { query, receiveInit, receiveAction } from 'store/fetch';

//初始化常量state
const initialState = {
    fetching: false,
    headerData: {
        sitename: null,
    }
};

// head 获取数据
export function queryData(param) { return query('/api/zfirst', { param }); }

// head 获取数据 action
export function handleQueryData(param) {
    console.log("containers.handleQueryData");
    return (dispatch) => {
        // dispatch(receiveInit());
        let action = receiveAction();
        queryData(param)
            .then((r) => {
                action.payload.headerData = r.result.headerData;
                dispatch(action);
            }, () => {
                dispatch(action);
            });
    }
}

// head 获取数据
export function queryDataNav(param) { return query('/api/znav', { param }); }

// head 获取数据 action
export function handleQueryDataNav(param) {
    console.log("containers.handleQueryDataNav");
    return (dispatch) => {
        // dispatch(receiveInit());
        let action = receiveAction();
        queryDataNav(param).then((r) => {
            action.payload.nav = r.result.nav;
            dispatch(action);
        }, () => {
            dispatch(action);
        });
    }
}

// nav 鼠标移入移出事件
export function onMouseNav(nav, id, selected) {
    console.log("containers.onMouseNav")
    return (dispatch) => {
        nav.map((item) => {
            if (item.id == id) {
                item.selected = selected;
            }
        });
        let action = receiveAction();
        action.payload.nav = nav;
        console.log(nav);
        dispatch(action);
    }
}

// reducers
export default function zfirstReducer(state = initialState, action) {
    let r = Object.assign({}, state, action.payload);
    switch (action.type) {
        default:
            return r;
    }
}