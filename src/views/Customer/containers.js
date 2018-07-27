import { uuid } from 'store/util';
import { query } from 'store/fetch';

const initialState = {
  archive: {
    fetching: false,
    data: [],
    total: 0,
  },
  sender: {
    fetching: false,
    data: [],
    total: 0,
  },
  warehouse: {
    fetching: false,
    data: [],
    total: 0,
  },
  umbrella: {
    fetching: false,
    data: [],
    total: 0,
  },
  peer: {
    fetching: false,
    data: [],
    total: 0,
  },
};


// 客户档案关系常量
export const RECEIVE_CUSTOMERS_INIT = 'RECEIVE_CUSTOMERS_INIT';
export const RECEIVE_CUSTOMERS_ERRORS = 'RECEIVE_CUSTOMERS_ERRORS';
export const RECEIVE_CUSTOMERS_ARCHIVE = 'RECEIVE_CUSTOMERS_ARCHIVE';
export const RECEIVE_CUSTOMERS_ARCHIVE_CHILDREN = 'RECEIVE_CUSTOMERS_ARCHIVE_CHILDREN';
export const RECEIVE_CUSTOMERS_SENDER = 'RECEIVE_CUSTOMERS_SENDER';
export const RECEIVE_CUSTOMERS_UMBRELLA = 'RECEIVE_CUSTOMERS_UMBRELLA';
export const RECEIVE_CUSTOMERS_WAREHOUSE = 'RECEIVE_CUSTOMERS_WAREHOUSE';
export const RECEIVE_CUSTOMERS_PEER = 'RECEIVE_CUSTOMERS_PEER';


// 初始化请求
// 请求初始化
function receiveInit(obj) {
  const payload = {};
  payload[obj] = initialState[obj];
  payload[obj].fetching = true;
  return {
    type: RECEIVE_CUSTOMERS_INIT,
    payload,
  };
}

// 初始化请求错误
export function receiveErrors(obj) {
  const payload = {};
  payload[obj] = initialState[obj];
  payload[obj].fetching = false;
  return {
    type: RECEIVE_CUSTOMERS_ERRORS,
    payload,
  };
}

// 接受产品
export function receiveData(type, data, key = '') {
  return {
    type,
    payload: {
      fetching: false,
      ...data,
    },
    key,
  };
}
// 子数据处理
function archiveChildren(archives, key, children) {
  const archiveArr = archives;
  const archiveObj = archiveArr.data.find(archive => archive.key === key);
  if (archiveObj) {
    archiveObj.children = children.response;
  }
  return archiveArr;
}
// 产品查询
export function queryArchive(params) {
  return (dispatch) => {
    dispatch(receiveInit('archive'));
    query('/api/impala/reports/customer-relationship', params).then((response) => {
      if (response && response.data) {
        response.data.forEach((item) => {
          item.key = uuid(36);
          if (item.state === 'closed') {
            item.children = [{
              key: `item_${uuid()}`,
              custCode: '',
              custName: '',
              branchName: '',
              buName: '',
              biChannelName: '',
              cnChannelName: '加载中...',
              smChannelName: '',
              shareFlag: '',
              legalOwner: '',
              legalPhone: '',
              contactAddr: '',
            }];
          }
        });
      }
      dispatch(receiveData('RECEIVE_CUSTOMERS_ARCHIVE', response));
    }, () => {
      dispatch(receiveErrors('archive'));
    });
  };
}

export function getArchiveChildren(rowId, key) {
  return (dispatch) => {
    query('/api/impala/reports/customer-children', { rowId }).then((response) => {
      if (response && response.length) {
        response.forEach((item) => {
          item.key = uuid(36);
        });
      }
      dispatch(receiveData('RECEIVE_CUSTOMERS_ARCHIVE_CHILDREN', { response }, key));
    }, () => {
      dispatch(receiveErrors('archive'));
    });
  };
}
// 获取送达数据
export function querySender(params) {
  return (dispatch) => {
    dispatch(receiveInit('sender'));
    query('/api/impala/reports/sh', params).then((response) => {
      dispatch(receiveData('RECEIVE_CUSTOMERS_SENDER', response));
    }, () => {
      dispatch(receiveErrors('sender'));
    });
  };
}
// 获取仓库数据
export function queryWarehouse(params) {
  return (dispatch) => {
    dispatch(receiveInit('warehouse'));
    query('/api/impala/reports/storage', params).then((response) => {
      dispatch(receiveData('RECEIVE_CUSTOMERS_WAREHOUSE', response));
    }, () => {
      dispatch(receiveErrors('warehouse'));
    });
  };
}
// 获取伞下店
export function queryUmbrella(params) {
  return (dispatch) => {
    dispatch(receiveInit('umbrella'));
    query('/api/impala/reports/sxtj', params).then((response) => {
      dispatch(receiveData('RECEIVE_CUSTOMERS_UMBRELLA', response));
    }, () => {
      dispatch(receiveErrors('umbrella'));
    });
  };
}
// 获取同级数据
export function queryPeer(params) {
  return (dispatch) => {
    dispatch(receiveInit('peer'));
    query('/api/impala/reports/sxtj', params).then((response) => {
      dispatch(receiveData('RECEIVE_CUSTOMERS_PEER', response));
    }, () => {
      dispatch(receiveErrors('peer'));
    });
  };
}
// reducers
export default function customersReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CUSTOMERS_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_CUSTOMERS_ARCHIVE:
      return Object.assign({}, state, { archive: action.payload });
    case RECEIVE_CUSTOMERS_ARCHIVE_CHILDREN:
      return Object.assign({}, state, {
        archive: archiveChildren(state.archive, action.key, action.payload),
      });
    case RECEIVE_CUSTOMERS_SENDER:
      return Object.assign({}, state, { sender: action.payload });
    case RECEIVE_CUSTOMERS_WAREHOUSE:
      return Object.assign({}, state, { warehouse: action.payload });
    case RECEIVE_CUSTOMERS_UMBRELLA:
      return Object.assign({}, state, { umbrella: action.payload });
    case RECEIVE_CUSTOMERS_PEER:
      return Object.assign({}, state, { peer: action.payload });
    case RECEIVE_CUSTOMERS_ERRORS:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
