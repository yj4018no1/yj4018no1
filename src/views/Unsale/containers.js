import { query } from 'store/fetch';
import { formatPrice, formatCount } from 'store/util';

const initialState = {
  fetching: false,
  column: [],
  result: {
    data: [],
    total: 0,
  },
};

// 定义滞销常量
export const RECEIVE_UNSALE_INIT = 'RECEIVE_UNSALE_INIT';
export const RECEIVE_UNSALE_ERRORS = 'RECEIVE_UNSALE_ERRORS';
export const RECEIVE_UNSALE = 'RECEIVE_UNSALE';

// 滞销请求初始化
export function receiveInit() {
  return {
    type: RECEIVE_UNSALE_INIT,
    payload: {
      fetching: true,
    },
  };
}

// 滞销初始化请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_UNSALE_ERRORS,
    payload: {
      fetching: false,
    },
  };
}

// 接收滞销分析的数据
export function receiveUnsale(data) {
  return {
    type: RECEIVE_UNSALE,
    payload: {
      fetching: false,
      ...data,
    },
  };
}


// 滞销查询
export function queryUnsale(params) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/unsale', params).then((data) => {
      const { result } = data;
      result.data.forEach((item) => {
        item.positiveQuantity = formatCount(item.quantity);
        // 金额格式化
        item.fee = formatPrice(item.fee, 10000, 4);
      });
      dispatch(receiveUnsale(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

// reducers
export default function unsaleReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_UNSALE_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_UNSALE_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_UNSALE:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
