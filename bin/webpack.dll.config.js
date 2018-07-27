const path = require('path');
const webpack = require('webpack');
// 获取项目基本目录结构
const base = (...args) =>
  Reflect.apply(path.resolve, null, [path.resolve(__dirname, '..'), ...args]);


// 第三方依赖库
const VENDORS = [
  'antd',
  'echarts',
  'superagent',
  'babel-polyfill',
  'eventsource-polyfill',
  'element-resize-event',
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'redux',
  'redux-thunk',
];

module.exports = {
  context: base(),
  entry: {
    vendor: VENDORS,
  },
  output: {
    path: base('dll'),
    filename: '[name].dll.js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      path: base('manifest.json'),
      name: '[name]',
      context: base(),
    }),
  ],
};
