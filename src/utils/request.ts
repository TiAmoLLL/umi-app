import { notification } from 'antd';
import { extend } from 'umi-request';
import tools from './tools';

// 创建一个扩展实例
const request = extend({
  // 配置的默认参数
  timeout: 10000, // 请求超时时间
  credentials: 'include', // 默认携带 cookie
});
// 处理未授权的函数
const handleUnauthorized = () => {
  notification.error({
    message: '未授权',
    description: '登录已过期，请重新登录。',
  });
  tools.data.remove('user'); // 清除用户信息
  setTimeout(() => {
    window.location.href = '/login'; // 重定向到登录页面
  }, 500); // 给用户一些时间查看消息
};

// 处理状态码的函数
const handleStatusCode = (error: any) => {
  const status = error.response.status;
  if (status === 401) {
    handleUnauthorized();
  } else {
    notification.error({
      message: `请求错误 ${status}`,
      description: error.response.statusText,
    });
  }
};
// 请求拦截器
request.interceptors.request.use((url: string, options: any) => {
  console.log(url, options);
  if (url === '/api/auth/login') {
    // 登录请求，不需要携带 token
    return {
      url,
      options,
    };
  } else {
    // 在请求发出前可以做一些事情，比如添加 x-Token
    const user = tools.data.get('user');
    if (!user) {
      // 如果没有用户信息，重定向到登录页面
      window.location.href = '/login'; // 使用 window.location.href 进行重定向
    }
    console.log(user);

    const headers = {
      ...options.headers,
      'x-Token': `Bearer ${user.token}`, // 如果有 token 添加到请求头中
    };
    return {
      url,
      options: { ...options, headers },
    };
  }
});

// 响应拦截器
request.interceptors.response.use(
  async (response: any) => {
    // 在响应数据返回之前，可以做一些全局的处理
    const res = await response.clone().json();
    console.log(res, '在响应数据返回之前，可以做一些全局的处理');

    if (res.code === 401) {
      handleUnauthorized(); // 处理未授权
    }
    if (res.code !== 200) {
      notification.error({
        message: `请求错误 ${res.code}`,
        description: res.message || 'Error',
      });
    }
    return res;
  },
  (error: any) => {
    console.log('处理请求失败的情况');

    // 处理请求失败的情况
    if (error.response) {
      // const status = error.response.status;
      handleStatusCode(error); // 调用处理状态码的函数
    } else {
      notification.error({
        message: '网络错误',
        description: '无法连接服务器，请检查网络。',
      });
    }
    return Promise.reject(error);
  },
);

export default request;
