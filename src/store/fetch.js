import { notification } from 'antd';
import request from './agent';
import { ERRORMESSAGE } from './errorMessage';
import { delSession, logoutAction } from './requireAuth';
// ===========================================
// action 相关
// fetch type 类型
export const receiveDataType = {
  RECEIVE_DATA_INIT: "RECEIVE_DATA_INIT", // 初始化
  RECEIVE_DATA_ERRORS: "RECEIVE_DATA_ERRORS", // 错误
  RECEIVE_DATA_OPTTIONS: "RECEIVE_DATA_OPTTIONS", // 操作
}
// action 开始执行
export function receiveInit() {
  return {
      type: receiveDataType.RECEIVE_DATA_INIT,
      payload: {
          fetching: true,
      },
  };
}
// 请求数据后 获取返回的action结构
export function receiveAction() {
  return {
      type: receiveDataType.RECEIVE_DATA_OPTTIONS,
      payload: {
          fetching: false,
      },
  };
}
// ===========================================

// 根据返回的数据做检查 PS: 登录过期
function checkData(response) {
  // console.log("fetch.checkData.response", response);
  let data = null;
  if (response.ok) {
    data = response.body;
  }
  return Promise.resolve(data);
}
// 数据异常捕获
function errorCatch(error) {
  // if (error.errMsg === 'user.not.login') {
  //   logoutAction();
  //   delSession('bvs');
  // }
  notification.error({
    message: '系统错误',
    description: ERRORMESSAGE[error.errMsg] || '未知错误',
  });
  return Promise.reject(error);
}

// get 请求直接在 API 后带参数 api/get/:id
export function get(api) {
  return request
    .get(api)
    .then(response => checkData(response), error => errorCatch(error));
    // .end((error, res) => {
    //   console.log('error', error);
    //   console.log('res', res);
    // });
}

// query 查询接口
export function query(api, params = null) {
  return request
    .get(api)
    .query(params)
    .then(response => checkData(response), error => errorCatch(error));
}

// post 请求发送对象
export function post(api, params = null) {
  return request
    .post(api)
    .send(params)
    .then(response => checkData(response), error => errorCatch(error));
}

// put 请求更改数据类型
export function update(api) {
  return request
    .put(api)
    .then(response => checkData(response), error => errorCatch(error));
}

// 删除
export function remove(api) {
  return request
    .del(api)
    .then(response => checkData(response), error => errorCatch(error));
}
