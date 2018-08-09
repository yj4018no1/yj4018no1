import Webpack from 'webpack';
import cssnano from 'cssnano';
import HappyPack from 'happypack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OpenBrowserWebpackPlugin from 'open-browser-webpack-plugin';

import _debug from 'debug';

import config from './config';

const debug = _debug('app:webpack.config');
const paths = config.utils_paths;
const BASE_CSS_LOADER = 'css?sourceMap&-minimize';
// 获取当前的执行环境
const {
  __DEV__,
} = config.globals;
debug('👻 初始化 webpack 默认配置...');
const APP_ENTRY = ['babel-polyfill', 'eventsource-polyfill', paths.src('main.js')];
const webpackConfig = {
  name: 'client',
  target: 'web', // 打包成什么类型
  devtool: config.devtool,
  entry: {
    app: __DEV__ ? APP_ENTRY.concat(`webpack-hot-middleware/client?path=${config.public_path}__webpack_hmr`) : APP_ENTRY,
    vendor: config.vendor, // 第三方包
  },
  output: { // 输出配置
    filename: __DEV__ ? '[name].js?[hash]' : '[name].[chunkhash].js',
    chunkFilename: __DEV__ ? '[name].[id].js?[hash]' : '[name].[id].[chunkhash].js',
    path: paths.dist(),
    publicPath: config.public_path,
  },
  resolve: {
    root: paths.src(), // 根目录: 这样可以在内部使用时 是从 src 目录查找 不需要 ../../../ 这样的写法
    modulesDirectories: ['node_modules', paths.base('node_modules')],
    extensions: ['', '.js', '.jsx', '.json'],
    // 导入时可以不用加后缀名, 但是一定要加个空字符因为覆盖了默认的导入行为, 比如导入 a.txt 文件就报错了
    alias: {
      styles: paths.src('styles'),
    },
  },
  module: {
    noParse: [/moment.js/], // 不解析 moment
    loaders: [{
      test: /\.(js|jsx)$/,
      // exclude: /node_modules/,
      exclude: (path) => {
        const isNpmModule = !!path.match(/node_modules/);
        return isNpmModule;
      },
      include: [
        paths.src(),
      ],
      loader: 'happypack/loader?id=babel',
    }, {
      test: /\.scss$/,
      exclude: null,
      loaders: [
        'style-loader',
        BASE_CSS_LOADER,
        'postcss-loader',
        'sass-loader?sourceMap',
      ],
    }, {
      test: /\.less$/,
      exclude: null,
      loaders: [
        'style-loader',
        BASE_CSS_LOADER,
        'postcss-loader',
        'less-loader?sourceMap',
      ],
    }, {
      test: /\.css$/,
      exclude: null,
      loaders: [
        'style-loader',
        BASE_CSS_LOADER,
        'postcss-loader',
      ],
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.woff(\?.*)?$/,
      loader: 'url-loader?prefix=fonts/&name=static/font/[name].[ext]&limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.woff2(\?.*)?$/,
      loader: 'url-loader?prefix=fonts/&name=static/font/[name].[ext]&limit=10000&mimetype=application/font-woff2',
    }, {
      test: /\.otf(\?.*)?$/,
      loader: 'file-loader?prefix=fonts/&name=static/font/[name].[ext]&limit=10000&mimetype=font/opentype',
    }, {
      test: /\.ttf(\?.*)?$/,
      loader: 'url-loader?prefix=fonts/&name=static/font/[name].[ext]&limit=10000&mimetype=application/octet-stream',
    }, {
      test: /\.eot(\?.*)?$/,
      loader: 'file-loader?prefix=fonts/&name=static/font/[name].[ext]',
    }, {
      test: /\.svg(\?.*)?$/,
      loader: 'url-loader?prefix=fonts/&name=static/font/[name].[ext]&limit=10000&mimetype=image/svg+xml',
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?limit=8192&name=static/images/[name].[ext]',
    }],
  },
  // 插件
  plugins: [
    new HappyPack({
      id: 'babel',
      loaders: [{
        path: paths.nodeModules('babel-loader/lib/index.js'),
        query: `?${JSON.stringify(config.babelConfig)}`,
      }],
    }),
    new Webpack.DefinePlugin(config.globals), // 根据开发环境生成对应的全局变量
    new HtmlWebpackPlugin({
      template: paths.src('index.html'),
      hash: false,
      favicon: paths.src('static/favicon.ico'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
    }),
  ],
  // sassloader 配置
  sassLoader: {
    includePaths: paths.src('styles'),
  },
  // postcss 配置
  postcss: [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 9', 'iOS >= 8', 'Android >= 4'],
      },
      discardComments: {
        removeAll: true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: true,
    }),
  ],
};

if (__DEV__) {
  debug('🐞 开发模式启用热部署插件 (HMR, NoErrors).');
  webpackConfig.plugins.push(
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NoErrorsPlugin(),
    new OpenBrowserWebpackPlugin({ url: `http://localhost:${config.server_port}/`, browser: "chrome" }),
  );
} else {
  debug('🐲 启用生产模式插件 (OccurenceOrder, Dedupe & UglifyJS).');
  webpackConfig.plugins.push(
    new Webpack.optimize.OccurrenceOrderPlugin(), // 模块签名
    new Webpack.optimize.DedupePlugin(), // 去除重复文件
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      },
    }));
}

// 打包配置 将 css 从 style 标签里面抽到 app.css 里面
// 因为开发环境下没有启用 ExtractTextPlugin 所以样式都是在 style 标签里面
if (!__DEV__) {
  debug('启用 ExtractTextPlugin...');
  webpackConfig.module.loaders.filter(loader =>
    loader.loaders && loader.loaders.find(name => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const cssLoader = loader;
    const first = cssLoader.loaders[0];
    const rest = cssLoader.loaders.slice(1);
    cssLoader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete cssLoader.loaders;
  });

  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true,
    }));
}
export default webpackConfig;
