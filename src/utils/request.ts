import { notification } from 'antd';
import { extend } from 'umi-request';
import tools from './tools';
// 创建一个扩展实例
const request = extend({
  // 配置的默认参数
  timeout: 10000, // 请求超时时间
  credentials: 'include', // 默认携带cookie
});

// 请求拦截器
request.interceptors.request.use((url, options) => {
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
  async (response) => {
    // 在响应数据返回之前，可以做一些全局的处理
    const res = await response.clone().json();
    if (res.code !== 200) {
      notification.error({
        message: `请求错误 ${res.code}`,
        description: res.message || 'Error',
      });
    }
    return res;
  },
  (error) => {
    // 处理请求失败的情况
    if (error.response) {
      notification.error({
        message: `请求错误 ${error.response.status}`,
        description: error.response.statusText,
      });
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
