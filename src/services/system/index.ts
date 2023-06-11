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
    return request(`/sys/client/approve`, {
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

  static uploadFront(data: any): Promise<any> {
    let _formData = new FormData();
    _formData.append('file', data);
    return request(`/client/file/upload/front`, {
      method: 'post',
      data: _formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static upload(data: any): Promise<any> {
    let _formData = new FormData();
    _formData.append('file', data);
    return request(`/client/file/upload/image`, {
      method: 'post',
      data: _formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static deleteFile(data: any): Promise<any> {
    return request(`/client/file/delete?path`, {
      method: 'delete',
      data: data,
    });
  }
}

export default System;
