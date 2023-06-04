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

  static vertication(data: any): Promise<any> {
    return request(`/client/approve`, {
      method: 'post',
      data,
    });
  }

  static userInfo(): Promise<any> {
    return request(`/user/getUserPerm`, {
      method: 'get',
    });
  }

  static getAllBusiness(data: string): Promise<any> {
    return request(`/sys/user/list?nameOrId=${data}`, {
      method: 'get',
    });
  }

  static logout(data: any): Promise<any> {
    return request(`/logout`, {
      method: 'post',
    });
  }

  static uploadFront(userId: number, data: any): Promise<any> {
    let _formData = new FormData();
    _formData.append('file', data);
    return request(`/client/file/upload/front/${userId}`, {
      method: 'post',
      data: _formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static upload(userId: number, data: any): Promise<any> {
    let _formData = new FormData();
    _formData.append('file', data);
    return request(`/client/file/upload/image/${userId}`, {
      method: 'post',
      data: _formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default System;
