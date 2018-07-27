import Koa from 'koa';
import Mock from 'mockjs';
import pathToRegexp from 'path-to-regexp';
import _debug from 'debug';
import APIS from './api';

const info = _debug('app:mock');

const app = new Koa();

app.use(async(ctx, next) => {
  const reqAPI = ctx.path;
  let mockConfig = null;
  APIS.forEach((api) => {
    const regexp = api.URL.includes(':') && pathToRegexp(api.URL);
    if (regexp && regexp.test(reqAPI)) {
      mockConfig = api[ctx.method];
      return;
    } else if (api.URL === reqAPI) {
      mockConfig = api[ctx.method];
      return;
    }
  });
  const responseData = Mock.mock(mockConfig || {
    success: false,
    error: `没有配置${reqAPI}, 请添加`,
    data: null,
  });
  ctx.body = responseData;
  console.log(`接口地址: http://localhost:9999${reqAPI}`);
  await next();
});

app.listen(9999, (err) => {
  if (err) {
    info(err);
  }
  info('📢 mockser 启动成功, 端口: 9999');
});
