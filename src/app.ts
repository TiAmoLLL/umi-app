import { message } from 'antd';
import tools from './utils/tools';
// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  console.log('测试');

  if (location.pathname === '/login') {
    // 强行进入登录页
    const token = tools.data.get('user').token;
    if (token) {
      const res = await fetch('/api/user/info');
      if (res.data) {
        // 说明不仅有 token 而且 token 有效
        message.error('请先退出后再登录');
        history.go(-1);
      }
    }
  } else {
    // 进入其他页面
    console.log('进入其他页面');

    const user = tools.data.get('user');
    console.log('token', !!user);

    // const res = await fetch('/api/user/info');
    if (user && user.token) {
      // 说明不仅有 token 而且 token 有效
      console.log('token 有效');
      return { name: '@umijs/max' };
    } else {
      // 说明没有 token 或者 token 无效 需要重新登录
      console.log('说明没有 token 或者 token 无效 需要重新登录  ');

      localStorage.removeItem('token');
      // message.error('用户无效，请先登录');
      location.href = '/login';
    }
  }
  console.log('出循环');
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    layout: 'mix',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    logout: (initialState: any) => {
      console.log('退出登录', initialState);
      // 退出登录的配置

      localStorage.removeItem('token');
      location.href = '/login';
      // message.success('退出成功')
    },
  };
};
