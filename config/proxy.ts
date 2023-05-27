/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  local: {
    '/api/': {
      target: 'http://115.220.5.245:8086',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/mock/': {
      target: 'http://172.16.0.151:3000/mock/19/',
      // target: 'http://yapi.smart-xwork.cn/mock/79362/',
      changeOrigin: true,
      pathRewrite: { '^/mock': '' }
    },
  },
  dev: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
