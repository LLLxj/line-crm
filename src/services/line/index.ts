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

  static getAllCustomer(data: string): Promise<any> {
    return request(`/sys/user/client/list?userName=${data}`, {
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
      method: 'post',
      data,
    });
  }

  static detail(data: number): Promise<any> {
    return request(`/sys/line/info/${data}`, {
      method: 'get',
    });
  }

  static normal(data: number): Promise<any> {
    return request(`/sys/line/normal/${data}`, {
      method: 'put',
    });
  }

  static disabled(data: number): Promise<any> {
    return request(`/sys/line/disable/${data}`, {
      method: 'put',
    });
  }

  static exportBisiness(data: any): Promise<any> {
    return request(`/sys/line/client/export`, {
      method: 'post',
      data,
    });
  }

  static exportCustomer(data: any): Promise<any> {
    return request(`/sys/line/own/export`, {
      method: 'post',
      data,
    });
  }

  static getTemplate(): Promise<any> {
    return request(`/sys/line/export/template`, {
      method: 'post',
    });
  }

  static import(data: any): Promise<any> {
    let _formData = new FormData();
    _formData.append('file', data);
    return request(`/sys/line/upload/excel`, {
      method: 'post',
      data: _formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default Line;
