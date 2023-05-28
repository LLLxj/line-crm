import request from '@/utils/request';
class Line {

  static list (data: any): Promise<any> {
    return request(
      `/sys/line/client/queryPage`,
      {
        method: 'post',
        data
      }
    )
  }

  static save (data: any): Promise<any> {
    return request(
      `/sys/line/client/save`,
      {
        method: 'post',
        data
      }
    )
  }

  static update (data: any): Promise<any> {
    return request(
      `/sys/line/client/update`,
      {
        method: 'put',
        data
      }
    )
  }

  static detail (data: number): Promise<any> {
    return request(
      `/sys/line/client/${data}`,
      {
        method: 'get',
      }
    )
  }


  static normal (data: number): Promise<any> {
    return request(
      `/sys/line/client/normal/${data}`,
      {
        method: 'put',
      }
    )
  }

  static disabled (data: number): Promise<any> {
    return request(
      `/sys/line/client/disabled/${data}`,
      {
        method: 'put',
      }
    )
  }

  static export (): Promise<any> {
    return request(
      `/sys/line/client/export`,
      {
        method: 'put',
      }
    )
  }

}

export default Line


