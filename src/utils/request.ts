/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { history } from 'umi';

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

interface SrmResponseProps extends Response {
  code?: number;
  result?: any;
  options?: any;
  msg?: string;
}

/**
 * @zh-CN 异常处理程序
 * @en-US Exception handler
 */
const errorHandler = (error: { response: Response; data: any }): Response => {
  const { response } = error;
  if (response && response.status) {
    let errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    if (status === 400) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
    if (status === 500) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
    if (status === 403) {
      message.warning('登录已失效，请重新登录');
      localStorage.removeItem('token');
      history.replace('/login');
    }
    if (status === 502) {
      notification.error({
        message: codeMessage?.[status],
      });
    }
  } else if (!response) {
    notification.error({
      description: 'Your network is abnormal and cannot connect to the server',
      message: 'Network anomaly',
    });
  }
  // return response;
};

/**
 * @en-US Configure the default parameters for request
 * @zh-CN 配置request请求时的默认参数
 */
const request = extend({
  prefix: '/api',
  errorHandler, // default error handling
  credentials: 'include', // Does the default request bring cookies
  timeout: 20000,
});

request.interceptors.request.use((url: string, options: any) => {
  const token = localStorage.getItem('token');
  return {
    url,
    options: {
      ...options,
      headers: {
        Authorization: token,
      },
    },
  };
});

request.interceptors.response.use((response: Response) => {
  const authorization = response.headers.get('authorization');
  if (authorization) {
    localStorage.setItem('authorization', authorization);
    localStorage.setItem('taskCenterToken', authorization);
  }
  return response;
});

const checkStauts = (response: SrmResponseProps, url: string) => {
  if (!response) {
    return Promise.reject(response);
  }
  switch (response?.code) {
    case 10000:
    case 0: {
      return response;
    }
    case 1: {
      message.error(response.msg);
      return Promise.reject(response);
    }
    case -1: {
      message.error(response.msg);
      return Promise.reject(response);
    }
    case 1001: {
      if (url?.includes('sys/line/upload/excel')) {
        message.warning(response.msg, 5);
      } else {
        message.error(response.msg);
      }
      return Promise.reject(response);
    }
    case 400: {
      message.error(response.msg);
      return Promise.reject(response);
    }
    case 1018: {
      if (response.code === 1018) {
        message.warning('登录已失效，请重新登录');
        localStorage.removeItem('token');
        history.push('/login');
      }
      return Promise.reject(response);
    }
    case 1019: {
      message.warning('登录已失效，请重新登录');
      localStorage.removeItem('token');
      history.push('/login');
      return Promise.reject(response);
    }
    case 403: {
      message.error(response.result);
      return response;
    }
    default: {
      return Promise.resolve(response);
    }
  }
};

const httpRequest = (url: string, options?: any) => {
  return request(url, options).then((response: any) =>
    checkStauts(response, url),
  );
};

export default httpRequest;
