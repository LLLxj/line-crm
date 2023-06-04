import request from '@/utils/request';

class System {
  static login(data: any): Promise<any> {
    return request(`/admin/login`, {
      method: 'post',
      data,
    });
  }

  static register(data: any): Promise<any> {
    return request(`/client/enroll`, {
      method: 'post',
      data,
    });
  }

  static userInfo(): Promise<any> {
    return request(`/user/getUserPerm`, {
      method: 'get',
    });
  }

  static getAllBusiness(): Promise<any> {
    return request(`/sys/user/list`, {
      method: 'get',
    });
  }

  static logout(data: any): Promise<any> {
    return request(`/logout`, {
      method: 'post',
    });
  }
}

export default System;
