// ------------------------------------
// 单独创建该文件来监听理由的变化,并存储路由状态
// ------------------------------------

// 路由常量
export const LOCATION_CHANGE = 'LOCATION_CHANGE';

// 路由变化 action
export function locationChange(location = '/') {
  return {
    type: LOCATION_CHANGE,
    payload: location,
  };
}

// 更新路由 action
export function updateLocation({ dispatch }) {
  return nextLocation => dispatch(locationChange(nextLocation));
}

// 路由监听 reducer
export default function locationReducer(state = null, action) {
  return action.type === LOCATION_CHANGE ? action.payload : state;
}
