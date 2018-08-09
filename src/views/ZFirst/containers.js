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
        queryData(param).then((r) => {
            action.payload.headerData = r.result.headerData;
            dispatch(action);
        }, () => {
            dispatch(action);
        });
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