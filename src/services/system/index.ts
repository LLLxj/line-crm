import request from '@/utils/request';

class System {

  static login (data: any): Promise<any> {
    return request(
      `/login`,
      {
        method: 'post',
        data
      }
    )
  }

  static register (data: any): Promise<any> {
    return request(
      `/client/enroll`,
      {
        method: 'post',
        data
      }
    )
  }

  static userInfo (data: any): Promise<any> {
    return request(
      `/sys/user/info/${data}`,
      {
        method: 'get'
      }
    )
  }

  static logout (data: any): Promise<any> {
    return request(
      `/logout`,
      {
        method: 'post'
      }
    )
  }

}

export default System


