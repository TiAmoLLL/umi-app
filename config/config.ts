import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login', // 添加 Login 路由
      layout: false, // 不使用主布局
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '账号管理',
      path: '/admin',
      component: './Admin',
    },
    {
      name: '用户管理',
      path: '/user',
      component: './User',
    },
    {
      name: '商品管理',
      path: '/goods',
      component: './Goods',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'yarn',
  proxy: {
    '/api': {
      // 'target': 'http://192.168.2.74:5678',
      // 'target': 'http://10.0.0.95:18099',
      // 'target': 'https://xxx.cityme.com.cn',
      target: 'http://localhost:3001',
      changeOrigin: true,
      // 'pathRewrite': { '^/api': '' },
    },
  },
  define: {
    'process.env.REACT_APP_BASE_URL':
      process.env.REACT_APP_BASE_URL || 'http://localhost:3001', // 引入环境变量
  },
});
