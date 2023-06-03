import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useRequest } from 'ahooks';
import LineService from '@/services/line'
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

interface ListProps {
  list: any[];
  loading: boolean;
  pages: any;
}

const List: React.FC<ListProps> = ({
  list,
  pages,
  loading
}) => {


  const columns: any[] = [
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '登录IP',
      dataIndex: 'loginIp',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '登录错误次数',
      dataIndex: 'errorNum',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
    },
    {
      title: '解锁时间',
      dataIndex: 'unLockTime',
    }
  ]

  return (
    <Table
      rowKey={record => record?.key}
      loading={loading}
      columns={columns}
      dataSource={list}
      pagination={pages}
      bordered
      // scroll={{
      //   x: tableWidth
      // }}
    />
  );
}

export default List