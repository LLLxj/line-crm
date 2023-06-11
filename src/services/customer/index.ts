import request from '@/utils/request';
class Customer {
  static list(data: any): Promise<any> {
    return request(`/sys/client/queryPage`, {
      method: 'post',
      data,
    });
  }

  static save(data: any): Promise<any> {
    return request(`/sys/client/save`, {
      method: 'post',
      data,
    });
  }

  static update(data: any): Promise<any> {
    return request(`/sys/client/update`, {
      method: 'put',
      data,
    });
  }

  static detail(data: number): Promise<any> {
    return request(`/sys/client/info/${data}`, {
      method: 'get',
    });
  }

  static info(): Promise<any> {
    return request(`/sys/client/own/info`, {
      method: 'get',
    });
  }

  static updatePassword(data: number): Promise<any> {
    return request(`/sys/client/update/pwd`, {
      method: 'put',
      data,
    });
  }

  static resetPassword(data: number): Promise<any> {
    return request(`/sys/client/reset/pwd/${data}`, {
      method: 'put',
    });
  }

  static normal(data: number): Promise<any> {
    return request(`/sys/client/normal/${data}`, {
      method: 'put',
    });
  }

  static disabled(data: number): Promise<any> {
    return request(`/sys/client/disable/${data}`, {
      method: 'put',
    });
  }

  static unLock(data: number): Promise<any> {
    return request(`/sys/client/unLock/${data}`, {
      method: 'put',
    });
  }

  static updateBelong(data: number): Promise<any> {
    return request(`/sys/client/change/sale/${data}`, {
      method: 'put',
    });
  }
}

export default Customer;
