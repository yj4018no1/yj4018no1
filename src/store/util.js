import { divide, round } from 'lodash/math';
/*
* params:
*   price: 原数据
*   divisor: 需要除以的数值
*   accuracy: 保留小数的精度
*/
const countStr = count => count && count.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');

exports.formatCount = count => countStr(count);
exports.uuid = (length = 16) => Math.random().toString(length).substring(2);
exports.formatPrice = (price, divisor = 10000, accuracy = 2) => {
  let result = '￥ 0.00';
  if (price) {
    const divideNumber = divide(price, divisor);
    const roundNumber = round(divideNumber, accuracy);
    const roundNumberStr = roundNumber.toFixed(accuracy).toString();
    const roundSplit = roundNumberStr.split('.');
    return `￥ ${countStr(roundSplit[0])}.${roundSplit[1]}`;
    // if (roundNumberStr.indexOf('.') > 0 && roundNumberStr.split('.')[1].length < 2) {
    //   result = `￥ ${countStr(roundNumber.toFixed(accuracy))}`;
    // } else if (roundNumberStr.indexOf('.') < 0) {
    //   result = `￥ ${countStr(roundNumber)}.${'0'.repeat(accuracy)}`;
    // } else {
    //   result = `￥ ${countStr(roundNumber)}`;
    // }
  }
  return result;
};
