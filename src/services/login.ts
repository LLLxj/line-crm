import request from '@/utils/request';
class System {
  static getLoginInfo (): Promise<any> {
    
    return request(
      `/auth/cas-login-info/${APP_CLIENTID}`,
      {
        method: 'get'
      }
    )
  }

  static authCallback(params: any): Promise<any> {
    return request(
      `/auth/cas-callback`,
      {
        method: 'get',
        params: params
      }
    )
  }

  static biAuthCallback(params: any): Promise<any> {
    return request(
      `/bi/auth/cas-callback`,
      {
        method: 'get',
        params: params
      }
    )
  }

  static getUserInfo(): Promise<any> {
    return request(
      '/auth/user-info',
      {
        method: 'get'
      }
    );
  }

  /**
   * @description 获取cas token
   */
  static getCasToken(): Promise<any> {
    return request(
      '/auth/get-cas-token',
      {
        method: 'get'
      }
    );
  }

  static logout(): Promise<any> {
    return request(
      '/auth/logout',
      {
        method: 'get'
      }
    );
  }
}

export default System


