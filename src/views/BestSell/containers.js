import { query } from 'store/fetch';
import { formatPrice, formatCount } from 'store/util';

const initialState = {
  fetching: false,
  result: {
    data: [],
    total: 0,
  },
  column: [],
};
// 定义畅销常量
export const RECEIVE_BEST_INIT = 'RECEIVE_BEST_INIT';
export const RECEIVE_BEST_ERRORS = 'RECEIVE_BEST_ERRORS';
export const RECEIVE_BEST = 'RECEIVE_BEST';

// 畅销初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_BEST_INIT,
    payload: {
      fetching: true,
      result: {
        data: [],
        total: 0,
      },
      column: [],
    },
  };
}

// 畅销分析初始化请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_BEST_ERRORS,
    payload: {
      fetching: false,
      result: {
        data: [],
        total: 0,
      },
      column: [],
    },
  };
}

// 接受畅销分析
export function receivebestSell(data) {
  return {
    type: RECEIVE_BEST,
    payload: {
      fetching: false,
      ...data,
    },
  };
}

// 查询畅销分析
export function queryBestSell(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/bestselling/paging', param).then((response) => {
      const { result } = response;
      if (result && result.data) {
        result.data.forEach((item) => {
          item.totalQuantity = formatCount(item.totalQuantity);
          // 金额格式化
          item.totalFee = formatPrice(item.totalFee, 10000, 4);
        });
      }

      dispatch(receivebestSell(response));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

export default function bestSellReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_BEST_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BEST_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BEST:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
