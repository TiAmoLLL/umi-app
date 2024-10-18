// import { message } from 'antd';
// import tools from './utils/tools';
// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// export async function getInitialState() {
//   console.log('测试');

//   if (location.pathname === '/login') {
//     // 强行进入登录页
//     localStorage.removeItem('token');
//   } else {
//     // 进入其他页面
//     console.log('进入其他页面');

//     const user = tools.data.get('user');
//     console.log('token', !!user);

//     const res = await fetch('/api/user/info');
//     console.log(res);

//     if (user && user.token) {
//       // 说明不仅有 token 而且 token 有效
//       console.log('token 有效');
//       return { name: '@umijs/max' };
//     } else {
//       // 说明没有 token 或者 token 无效 需要重新登录
//       console.log('说明没有 token 或者 token 无效 需要重新登录  ');

//       localStorage.removeItem('token');
//       // message.error('用户无效，请先登录');
//       location.href = '/login';
//     }
//   }
//   console.log('出循环');
//   return { name: '@umijs/max' };
// }

export const layout = () => {
  // 在开发环境拦截掉findDOMNode is deprecated错误
  if (process.env.NODE_ENV === 'development') {
    const originalError = console.error;

    console.error = (...args) => {
      // 筛选掉包含特定内容的错误信息，比如 "findDOMNode"
      if (
        typeof args[0] === 'string' &&
        args[0].includes('findDOMNode is deprecated')
      ) {
        return;
      }
      // 对其他错误信息保持默认行为
      originalError(...args);
    };
  }
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
