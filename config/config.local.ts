import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    APP_CLIENTID: 'portal-local',
    APP_BI_CLIENTID: 'finebi-auth-local',
    APP_WEBSOCKET_URL: 'wss://superoa-test.moligroup.com/'
  }
})