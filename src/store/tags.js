import { get, query } from 'store/fetch';

const initialState = {
  branchs: {
    fetching: false,
    data: [],
  },
  companies: {
    fetching: false,
    data: [],
  },
  brands: {
    fetching: false,
    data: [],
  },
  goodsGroup: {
    fetching: false,
    data: [],
  },
  goodsSeries: {
    fetching: false,
    data: [],
  },
  goodsChannel: {
    fetching: false,
    data: [],
  },
  smallChannel: {
    fetching: false,
    data: [],
  },
  summaryChannel: {
    fetching: false,
    data: [],
  },
  goodsTypes: {
    fetching: false,
    data: [],
  },
  unitTypes: {
    fetching: false,
    data: [],
  },
};

export const RECEIVE_INIT = 'RECEIVE_INIT';
// 分中心
export const RECEIVE_BRANCH = 'RECEIVE_BRANCH';
// 小微
export const RECEIVE_COMPANY = 'RECEIVE_COMPANY';
// 品牌
export const RECEIVE_BRANDS = 'RECEIVE_BRANDS';
// 产品组
export const RECEIVE_GOODS_GROUP = 'RECEIVE_GOODS_GROUP';
// 产品系列
export const RECEIVE_GOODS_SERIRES = 'RECEIVE_GOODS_SERIRES';
// 大渠道
export const RECEIVE_GOODS_CHANNEL = 'RECEIVE_GOODS_CHANNEL';
// 小渠道
export const RECEIVE_SMALL_CHANNEL = 'RECEIVE_SMALL_CHANNEL';
// 汇总渠道
export const RECEIVE_SUMMARY_CHANNEL = 'RECEIVE_SUMMARY_CHANNEL';
// 商品类型
export const RECEIVE_GOODS_TYPES = 'RECEIVE_GOODS_TYPES';
// 往来单位类型
export const RECEIVE_UNIT_TYPES = 'RECEIVE_UNIT_TYPES';
// 错误处理
export const RECEIVE_ERROR = 'RECEIVE_ERROR';

// 错误处理
function receiveError() {
  return {
    type: RECEIVE_ERROR,
    payload: {
      fetching: false,
      payload: [],
    },
  };
}
// 请求初始化
function receiveInit(obj) {
  const payload = {};
  payload[obj] = initialState[obj];
  payload[obj].data = [{ key: 'loading', value: '加载中...' }];
  return {
    type: RECEIVE_INIT,
    payload,
  };
}
// 数据接收
export function receiveData(type, payload) {
  return {
    type,
    payload,
  };
}

// 获取分中心
export function getBranch(param, clear) {
  return (dispatch) => {
    if (clear) {
      dispatch(receiveData('RECEIVE_BRANCH', []));
    } else {
      dispatch(receiveInit('branchs'));
      query('/api/search/select/branch', param).then((data) => {
        dispatch(receiveData('RECEIVE_BRANCH', data));
      }, () => {
        dispatch(receiveError());
      });
    };
  };
}
// 获取小微
export function queryCompanies(branchCode) {
  return (dispatch) => {
    dispatch(receiveInit('companies'));
    query('/api/search/select/campany', { branchCode }).then((data) => {
      dispatch(receiveData('RECEIVE_COMPANY', data));
    }, () => {
      dispatch(receiveError());
    });
  };
}

// 获取品牌
export function getBrands(param, clear) {
  return (dispatch) => {
    if (clear) {
      dispatch(receiveData('RECEIVE_BRANDS', []));
    } else {
      dispatch(receiveInit('brands'));
      query('/api/search/select/brand', param).then((data) => {
        dispatch(receiveData('RECEIVE_BRANDS', data));
      }, () => {
        dispatch(receiveError());
      });
    }
  };
}

// 产品组
export function getGoodsGroup(param, clear) {
  return (dispatch) => {
    if (clear) {
      dispatch(receiveData('RECEIVE_GOODS_GROUP', []));
    } else {
      dispatch(receiveInit('goodsGroup'));
      query('/api/search/select/goodsGroup', param).then((data) => {
        dispatch(receiveData('RECEIVE_GOODS_GROUP', data));
      }, () => {
        dispatch(receiveError());
      });
    }
  };
}

// 产品系列
export function queryGoodsSeries(goodsGroupIds, comeFrom) {
  return (dispatch) => {
    dispatch(receiveInit('goodsSeries'));
    query('/api/search/select/goodsSeries', { goodsGroupIds, comeFrom }).then((data) => {
      dispatch(receiveData('RECEIVE_GOODS_SERIRES', data));
    }, () => {
      dispatch(receiveError());
    });
  };
}

// 商品类型
export function getGoodsTypes() {
  return (dispatch) => {
    dispatch(receiveInit('goodsTypes'));
    get('/api/search/select/goodsType').then((data) => {
      dispatch(receiveData('RECEIVE_GOODS_TYPES', data));
    }, () => {
      dispatch(receiveError());
    });
  };
}

// 往来单位类型
export function getUnitTypes() {
  return (dispatch) => {
    dispatch(receiveInit('unitTypes'));
    get('/api/search/select/partnerType').then((data) => {
      dispatch(receiveData('RECEIVE_UNIT_TYPES', data));
    }, () => {
      dispatch(receiveError());
    });
  };
}
// 大渠道
export function queryGoodsChannel() {
  return (dispatch) => {
    dispatch(receiveInit('goodsChannel'));
    get('/api/search/select/dqdChannel').then((data) => {
      dispatch(receiveData('RECEIVE_GOODS_CHANNEL', data));
    }, () => {
      dispatch(receiveError());
    });
  };
}
// 小渠道
export function querySmallChannel(hzChannelCode) {
  return (dispatch) => {
    dispatch(receiveInit('smallChannel'));
    query('/api/search/select/xqdChannel', { hzChannelCode }).then((data) => {
      dispatch(receiveData('RECEIVE_SMALL_CHANNEL', data));
    }, () => {
      dispatch(receiveError());
    });
  };
}
// 汇总渠道
export function getSummaryChannel(dqdChannelCode) {
  return (dispatch) => {
    dispatch(receiveInit('summaryChannel'));
    query('/api/search/select/hzChannel', { dqdChannelCode }).then((data) => {
      dispatch(receiveData('RECEIVE_SUMMARY_CHANNEL', data));
    }, () => {
      dispatch(receiveError());
    });
  };
}


// reducers
export default function tagsReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_INIT:
      return Object.assign({}, state, { ...action.payload });
    case RECEIVE_BRANCH:
      return Object.assign({}, state, { branchs: {
        data: action.payload,
        fetching: false,
      } });
    case RECEIVE_COMPANY:
      return Object.assign({}, state, { companies: {
        data: action.payload,
        fetching: false,
      } });
    case RECEIVE_BRANDS:
      return Object.assign({}, state, { brands: {
        data: action.payload,
        fetching: false,
      } });
    case RECEIVE_GOODS_GROUP:
      return Object.assign({}, state, { goodsGroup: {
        data: action.payload,
        fetching: false,
      } });
    case RECEIVE_GOODS_SERIRES:
      return Object.assign({}, state, { goodsSeries: {
        data: action.payload,
        fetching: false,
      } });
    case RECEIVE_GOODS_CHANNEL:
      return Object.assign({}, state, { goodsChannel: {
        data: action.payload,
        fetching: false,
      } });
    case RECEIVE_SUMMARY_CHANNEL:
      return Object.assign({}, state, { summaryChannel: {
        data: action.payload,
        fetching: false,
      } });
    case RECEIVE_SMALL_CHANNEL:
      return Object.assign({}, state, { smallChannel: {
        data: action.payload,
        fetching: false,
      } });

    case RECEIVE_GOODS_TYPES:
      return Object.assign({}, state, { goodsTypes: {
        data: action.payload,
        fetching: false,
      } });
    case RECEIVE_UNIT_TYPES:
      return Object.assign({}, state, { unitTypes: {
        data: action.payload,
        fetching: false,
      } });
    default:
      return state;
  }
}
