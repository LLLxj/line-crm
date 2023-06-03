import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  primaryColor: '#8031a7',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'crm',
  pwa: false,
  iconfontUrl: '//at.alicdn.com/t/c/font_4090775_9hv58p8tj3f.js',
  // iconfontUrl: '//at.alicdn.com/t/font_2784568_87tps1dprh2.js',
  // iconfontUrl: '//at.alicdn.com/t/font_2784568_glhupq00db6.js',
};

export type { DefaultSettings };

export default proSettings;
