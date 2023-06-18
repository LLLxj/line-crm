import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest } from 'ahooks';
import LineService from '@/services/line';
import { usePages } from '@/hooks';
import { Table, Form, Row, Col, Input, Button } from 'antd';
import { CommonLayoutSpace, Access } from '@/components';
import { countTableCellWidth } from '@/utils';
import Edit from './Edit';
import type { ModalInitRef } from '@/pages/type';
import { useToggle } from 'react-use';

interface ListProps {
  list: any[];
  loading: boolean;
  pages: any;
  freshCallback?: () => void;
  resource: 'business' | 'customer';
}

const List: React.FC<ListProps> = ({
  list,
  pages,
  loading,
  freshCallback,
  resource,
}) => {
  const editRef = useRef<ModalInitRef>();

  const usefulRequest = useRequest(LineService.normal, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      freshCallback && freshCallback();
    },
  });

  const disabledRequest = useRequest(LineService.disabled, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      freshCallback && freshCallback();
    },
  });

  const editFn = (_id?: number) => {
    editRef?.current?.init({
      id: _id,
    });
  };

  const useHandle = (_id: number) => {
    usefulRequest.run(_id);
  };

  const disHandle = (_id: number) => {
    disabledRequest.run(_id);
  };

  const columns: any[] = [
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: 'ip（节点线路）',
      dataIndex: 'ipAddr',
    },
    {
      title: '线路账号',
      dataIndex: 'lineAccount',
    },
    {
      title: '线路密码',
      dataIndex: 'linePwd',
    },
    {
      title: '失效时间',
      dataIndex: 'failureTime',
    },
    resource === 'business'
      ? {
          title: '状态',
          dataIndex: 'statusLabel',
        }
      : undefined,
    resource === 'business'
      ? {
          title: '操作',
          dataIndex: 'handle',
          fixed: 'right',
          titleCol: 10,
          render: (_, record: any) => {
            return (
              <>
                {record.status ? (
                  // <Access permission="修改用户状态">
                  <Button type="link" onClick={() => disHandle(record.lineId)}>
                    禁用
                  </Button>
                ) : (
                  // </Access>
                  // <Access permission="修改用户状态">
                  <Button type="link" onClick={() => useHandle(record.lineId)}>
                    启用
                  </Button>
                  // </Access>
                )}
                {/* <Access permission="修改用户"> */}
                <Button type="link" onClick={() => editFn(record.lineId)}>
                  编辑
                </Button>
                {/* </Access> */}
              </>
            );
          },
        }
      : undefined,
  ]?.filter(Boolean);

  return (
    <>
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
      <Edit ref={editRef} successCallback={freshCallback} />
    </>
  );
};

export default List;
