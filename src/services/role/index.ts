import request from '@/utils/request';
class Role {

  static list (data: any): Promise<any> {
    return request(
      `/sys/role/queryPage`,
      {
        method: 'post',
        data
      }
    )
  }

  static save (data: any): Promise<any> {
    return request(
      `/sys/role/save`,
      {
        method: 'post',
        data
      }
    )
  }

  static update (data: any): Promise<any> {
    return request(
      `/sys/role/update`,
      {
        method: 'put',
        data
      }
    )
  }

  static detail (data: number): Promise<any> {
    return request(
      `/sys/role/info/${data}`,
      {
        method: 'get',
      }
    )
  }

  static updatePassword (data: number): Promise<any> {
    return request(
      `/sys/role/update/pwd`,
      {
        method: 'put',
        data
      }
    )
  }

  static resetPassword (data: number): Promise<any> {
    return request(
      `/sys/role/reset/pwd/${data}`,
      {
        method: 'put',
      }
    )
  }

  static normal (data: number): Promise<any> {
    return request(
      `/sys/role/normal/${data}`,
      {
        method: 'put',
      }
    )
  }

  static disabled (data: number): Promise<any> {
    return request(
      `/sys/role/disabled/${data}`,
      {
        method: 'put',
      }
    )
  }

  static unLock (data: number): Promise<any> {
    return request(
      `/sys/role/unLock/${data}`,
      {
        method: 'put',
      }
    )
  }

}

export default Role


