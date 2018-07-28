#

## 使用方法
先安装好 node 环境 python 环境
```
1. 安装依赖
-- 1.1 npm 安装 国外镜像较慢 可采用下面对的taobao镜像安装
    npm install
-- 1.2 
    # a 注册模块镜像
    npm set registry https://registry.npm.taobao.org
    # b node-gyp 编译依赖的 node 源码镜像
    npm set disturl https://npm.taobao.org/dist
    # c 清空缓存
    npm cache clean --force
    # d 安装 cnpm
    npm install -g cnpm --registry=https://registry.npm.taobao.org
    # e 安装依赖包
    cnpm install

2. 开发模式
    npm run dev
3. 生产模式
    npm run prod
```

## 项目目录结构
bin  开发和生产环境配置
---- index.js koa 启动主文件
---- config.js 开发和生产的参数配置
---- build.js 生产构建文件
---- webpack.config.js webpack构建文件
src  项目主文件
---- components 组件目录
---- static 静态资源目录
---- store 项目核心文件
---- style 全局样式目录
---- views 页面路由
------- CoreLayout 主入口文件
------- Home 首页
------- Customer 客户档案关系
------- Goods 商品主数据
------- Billing 客商主数据
------- SaleReport 销售统计报表

## 如何和后端联调

1. bin目录下的config文件的proxy配置

2. 将其中的host的配置改成本机的localhost加上后端项目启动的端口号

   形如： http: // 127.0.0.1:8090

3. 在启动前端项目,在前端项目目录下执行： npm install

4. 成功后执行npm run dev ,启动成功后会在浏览器中打开一个新的页面

5. 这时候在前端发起的任何请求都会被转发到配置的后台