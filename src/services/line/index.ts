import request from '@/utils/request';
class Line {
  static businessList(data: any): Promise<any> {
    return request(`/sys/line/client/queryPage`, {
      method: 'post',
      data,
    });
  }

  static customerList(data: any): Promise<any> {
    return request(`/sys/line/own/queryPage`, {
      method: 'post',
      data,
    });
  }

  static getAllCustomer(): Promise<any> {
    return request(`/sys/user/client/list?userName=`, {
      method: 'get',
    });
  }

  static save(data: any): Promise<any> {
    return request(`/sys/line/save`, {
      method: 'post',
      data,
    });
  }

  static update(data: any): Promise<any> {
    return request(`/sys/line/update`, {
      method: 'put',
      data,
    });
  }

  static detail(data: number): Promise<any> {
    return request(`/sys/line/${data}`, {
      method: 'get',
    });
  }

  static normal(data: number): Promise<any> {
    return request(`/sys/line/client/normal/${data}`, {
      method: 'put',
    });
  }

  static disabled(data: number): Promise<any> {
    return request(`/sys/line/client/disable/${data}`, {
      method: 'put',
    });
  }

  static exportBisiness(): Promise<any> {
    return request(`/sys/line/client/export`, {
      method: 'put',
    });
  }

  static exportCustomer(): Promise<any> {
    return request(`/sys/line/client/export`, {
      method: 'put',
    });
  }
}

export default Line;
