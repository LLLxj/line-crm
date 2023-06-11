import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest } from 'ahooks';
import LineService from '@/services/line';
import { usePages } from '@/hooks';
import { Table, Form, Row, Col, Input, Button } from 'antd';
import { CommonLayoutSpace } from '@/components';
import { countTableCellWidth } from '@/utils';
import Edit from './Edit';
import type { ModalInitRef } from '@/pages/type';

interface ListProps {
  list: any[];
  loading: boolean;
  pages: any;
}

const List: React.FC<ListProps> = ({ list, pages, loading }) => {
  const columns: any[] = [
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: 'ip地址',
      dataIndex: 'ipAddr',
    },
    {
      title: '失效时间',
      dataIndex: 'failureTime',
    },
    {
      title: '状态',
      dataIndex: 'statusLabel',
    },
  ];

  return (
    <Table
      rowKey={(record) => record?.key}
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
};

export default List;
