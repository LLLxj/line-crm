import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useRequest } from 'ahooks';
import RoleService from '@/services/role'
import { usePages } from '@/hooks'
import {
  Table,
  Form,
  Row,
  Col,
  Input,
  Button
} from 'antd'
import { CommonLayoutSpace } from '@/components'
import { countTableCellWidth } from '@/utils'
import Edit from './Edit'
import type { ModalInitRef } from '@/pages/type'
import { AES, enc } from 'crypto-js';
import Utf8 from 'crypto-js/enc-utf8'

const Role: React.FC = () => {

  const [list, setList] = useState<any[]>([])
  const [tableWidth, setTableWidth] = useState<number>()
  const [form] = Form.useForm()
  const { defaultPaegs, pages, setPages } = usePages()
  const formatMap = {
    status: {
      0: '禁用',
      1: '正常'
    },
    isLock: {
      0: '是',
      1: '否'
    }
  }
  const editRef = useRef<ModalInitRef>()

  const getListRequest = useRequest(
    RoleService.list,
    {
      manual: true,
      debounceWait: 500,
      onSuccess: (data) => {
        console.log(data)
        const _list
          = data?.data?.list
              ?.map((item: { userId: any; isLock: 0 | 1; status: 0| 1 }) => {
                  return {
                    ...item,
                    key: item?.userId,
                    isLock: formatMap['isLock']?.[item?.isLock],
                    status: formatMap['status']?.[item?.status],
                  }
                })
        setPages({
          ...pages,
          total: data?.totalCount
        })
        setList(_list)
      }
    }
  )

  useEffect(() => {
    getListFn()
    const plaintext = 'string';
    const secretKey = 'lqgh6wk83975l826';
    console.log()
    const result = '1ANeRJ1Oq+zwGsRYmf2upQ==';
    const ciphertext = AES.encrypt(plaintext, secretKey).toString();
    console.log(ciphertext);
    console.log(result === ciphertext)
    var bytes = AES.encrypt(result, secretKey)
    console.log(bytes)
    console.log(plaintext === ciphertext);
  }, [])

  const getListFn = (_params = {}) => {
    getListRequest.run({
      pageNum: pages?.current,
      pageSize: pages?.pageSize,
      ..._params
      // pageSize: 20,
      // pageNum: 1
    })
  }

  const onSearch = async () => {
    const _formData = await form.getFieldsValue()
    getListFn(_formData)
  }

  const editFn = () => {
    editRef?.current?.init({})
  }

  const renderColumns = useMemo(() => {
    const _columns
      = columns?.map(item => {
          const _width =
            countTableCellWidth({
              title: item?.title,
              titleCol: item?.titleCol,
            })
          return {
            title: item?.title,
            dataIndex: item?.dataIndex,
            width: _width,
            render:
              item?.render
              // (_, record) => {
              //   return (
              //     <span>{ record?.[item?.dataIndex] || '--' } </span>
              //   )
              // }
          }
        })
    const _tableWidth
      = _columns
          ?.map(item => item?.width)
          ?.reduce((prev, cur) => {
              return prev + cur
            }, 0)
    setTableWidth(_tableWidth)
    return _columns
  }, [])

  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'roleName',
    },
    {
      title: '编码',
      dataIndex: 'roleCode',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
  ]

  return (
    <div>
       <Form
        form={form}
        labelCol={{
          span: 8
        }}
        wrapperCol={{
          span: 16
        }}
      >
        <Row
          gutter={[20, 20]}
        >
        
            <Col>
              <Form.Item
                label="用户名"
                name="userName"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={editFn}
              >
                新增
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={onSearch}
              >
                查询
              </Button>
            </Col>
          
        </Row>
      </Form>
      <Table
        rowKey={record => record?.key}
        loading={getListRequest?.loading}
        columns={columns}
        dataSource={list}
        bordered
        scroll={{
          x: tableWidth
        }}
      />
      <Edit
        ref={editRef}
      />
    </div>
   
  );
}

export default Role