import request from '@/utils/request';
class User {

  static list (data: any): Promise<any> {
    return request(
      `/sys/user/queryPage`,
      {
        method: 'post',
        data
      }
    )
  }

  static save (data: any): Promise<any> {
    return request(
      `/sys/user/save`,
      {
        method: 'post',
        data
      }
    )
  }

  static update (data: any): Promise<any> {
    return request(
      `/sys/user/update`,
      {
        method: 'put',
        data
      }
    )
  }

  static detail (data: number): Promise<any> {
    return request(
      `/sys/user/info/${data}`,
      {
        method: 'get',
      }
    )
  }

  static updatePassword (data: number): Promise<any> {
    return request(
      `/sys/user/update/pwd`,
      {
        method: 'put',
        data
      }
    )
  }

  static resetPassword (data: number): Promise<any> {
    return request(
      `/sys/user/reset/pwd/${data}`,
      {
        method: 'put',
      }
    )
  }

  static normal (data: number): Promise<any> {
    return request(
      `/sys/user/normal/${data}`,
      {
        method: 'put',
      }
    )
  }

  static disabled (data: number): Promise<any> {
    return request(
      `/sys/user/disabled/${data}`,
      {
        method: 'put',
      }
    )
  }

  static unLock (data: number): Promise<any> {
    return request(
      `/sys/user/unLock/${data}`,
      {
        method: 'put',
      }
    )
  }

}

export default User


