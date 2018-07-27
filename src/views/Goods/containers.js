import { query } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
  total: 0,
};

// 常量
export const RECEIVE_GOODS_INIT = 'RECEIVE_GOODS_INIT';
export const RECEIVE_GOODS_ERRORS = 'RECEIVE_GOODS_ERRORS';
export const RECEIVE_GOODS = 'RECEIVE_GOODS';

// 初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_GOODS_INIT,
    payload: {
      fetching: true,
    },
  };
}

// 初始化请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_GOODS_ERRORS,
    payload: {
      fetching: false,
      data: [],
      total: 0,
    },
  };
}

// 接受产品
export function receiveGoods(data) {
  return {
    type: RECEIVE_GOODS,
    payload: {
      fetching: false,
      ...data,
    },
  };
}


// 产品查询
export function queryGoods(params) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/paging-mdGoods', params).then((data) => {
      dispatch(receiveGoods(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

// reducers
export default function goodsReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_GOODS_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_GOODS_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_GOODS:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
