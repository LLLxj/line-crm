import request from '@/utils/request';
class Permission {
  static list(data: any): Promise<any> {
    return request(`/sys/perm/queryPage`, {
      method: 'post',
      data,
    });
  }

  static all(): Promise<any> {
    return request(`/sys/perm/list`, {
      method: 'post',
    });
  }

  static save(data: any): Promise<any> {
    return request(`/sys/perm/save`, {
      method: 'post',
      data,
    });
  }

  static update(data: any): Promise<any> {
    return request(`/sys/perm/update`, {
      method: 'put',
      data,
    });
  }

  static detail(data: number): Promise<any> {
    return request(`/sys/perm/info/${data}`, {
      method: 'get',
    });
  }

  static delete(data: number): Promise<any> {
    return request(`/sys/perm/delete/${data}`, {
      method: 'delete',
    });
  }
}

export default Permission;
