import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest, useSize } from 'ahooks';
import UserService from '@/services/user';
import { usePages, useCommonList, useContainerSize } from '@/hooks';
import { Table, Form, Row, Col, Input, Button, Space } from 'antd';
import { CommonLayoutSpace, Access } from '@/components';
import { countTableCellWidth } from '@/utils';
import Edit from './Edit';
import type { ModalInitRef } from '@/pages/type';
import { useToggle } from 'react-use';
import { SelectLocal } from '@/components';

import './index.less';

const User: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState<number>();
  const [form] = Form.useForm();
  const [refreshDeps, setRefreshDeps] = useToggle(false);
  const { defaultPaegs, pages, setPages } = usePages();
  const { optionMap: statusOptionsMap } = useCommonList('状态');
  const { optionMap: lockOptionsMap } = useCommonList('锁定');
  const { width, height } = useContainerSize();
  const searchContainerRef = useRef(null);
  const searchContainerSize = useSize(searchContainerRef);
  const formatMap = {
    status: {
      0: '禁用',
      1: '正常',
    },
    isLock: {
      0: '是',
      1: '否',
    },
  };
  const editRef = useRef<ModalInitRef>();
  const searchColSpan = 6;

  const getListRequest = useRequest(UserService.list, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
      const _list = data?.data?.list?.map(
        (item: { userId: any; isLock: 0 | 1; status: 0 | 1 }) => {
          return {
            ...item,
            key: item?.userId,
            isLockLabel: formatMap['isLock']?.[item?.isLock],
            statusLabel: formatMap['status']?.[item?.status],
          };
        },
      );
      setPages({
        ...pages,
        total: data?.data?.totalCount,
      });
      setList(_list);
    },
  });

  const usefulRequest = useRequest(UserService.normal, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      setRefreshDeps();
    },
  });

  const disabledRequest = useRequest(UserService.disabled, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      setRefreshDeps();
    },
  });

  const unlockRequest = useRequest(UserService.unLock, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      setRefreshDeps();
    },
  });

  useEffect(() => {
    getListFn();
  }, [refreshDeps]);

  const getListFn = (_params = {}) => {
    getListRequest.run({
      pageNum: pages?.current,
      pageSize: pages?.pageSize,
      ..._params,
    });
  };

  const onSearch = async () => {
    const _formData = await form.getFieldsValue();
    getListFn({
      ..._formData,
      pageNum: 1,
    });
  };

  const onReset = async () => {
    await form.resetFields();
    getListFn({
      pageNum: 1,
    });
    setPages(defaultPaegs);
  };

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

  const unlockHandle = (_id: number) => {
    unlockRequest.run(_id);
  };

  const pageChange = ({ current, pageSize }: any) => {
    setPages({
      ...pages,
      current,
      pageSize,
    });
    getListFn({
      pageNum: current,
      pageSize,
    });
  };

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
      dataIndex: 'statusLabel',
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
    },
    {
      title: '操作',
      dataIndex: 'handle',
      fixed: 'right',
      titleCol: 10,
      render: (_, record: any) => {
        return (
          <>
            {record.status ? (
              <Access permission="修改用户状态">
                <Button type="link" onClick={() => disHandle(record.userId)}>
                  禁用
                </Button>
              </Access>
            ) : (
              <Access permission="修改用户状态">
                <Button type="link" onClick={() => useHandle(record.userId)}>
                  启用
                </Button>
              </Access>
            )}
            <Access permission="修改用户">
              <Button type="link" onClick={() => editFn(record.userId)}>
                编辑
              </Button>
            </Access>
            <Access permission="解锁用户">
              <Button type="link" onClick={() => unlockHandle(record.userId)}>
                解锁系统用户
              </Button>
            </Access>
          </>
        );
      },
    },
  ];

  const renderColumns = useMemo(() => {
    const _columns = columns?.map((item) => {
      const _width = countTableCellWidth({
        title: item?.title,
        titleCol: item?.titleCol,
      });
      return {
        ...item,
        title: item?.title,
        dataIndex: item?.dataIndex,
        width: _width,
        ellipsis: true,
      };
    });
    const _tableWidth = _columns
      ?.map((item) => item?.width)
      ?.reduce((prev, cur) => {
        return prev + cur;
      }, 0);
    const _searchContainerHeight = searchContainerSize?.height || 0;
    const _tableHeight = height - 96 - _searchContainerHeight - 120;
    return {
      columns: _columns,
      tableWidth: _tableWidth * 1.5,
      tableHeight: _tableHeight,
    };
  }, [width, searchContainerRef?.current, height]);

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        width: '100%',
      }}
    >
      <div className="search__container" ref={searchContainerRef}>
        <Form
          form={form}
          labelCol={{
            span: 10,
          }}
          wrapperCol={{
            span: 14,
          }}
        >
          <Row gutter={[20, 0]}>
            <Col span={searchColSpan}>
              <Form.Item label="用户名" name="userName">
                <Input allowClear />
              </Form.Item>
            </Col>
            <Col span={searchColSpan}>
              <Form.Item label="手机号" name="msisdn">
                <Input allowClear />
              </Form.Item>
            </Col>
            <Col span={searchColSpan}>
              <Form.Item label="状态" name="status">
                <SelectLocal
                  list={statusOptionsMap?.options}
                  selectKey="value"
                  selectLabel="label"
                ></SelectLocal>
              </Form.Item>
            </Col>
            <Col span={searchColSpan}>
              <Form.Item label="是否锁定" name="isLock">
                <SelectLocal
                  list={lockOptionsMap?.options}
                  selectKey="value"
                  selectLabel="label"
                ></SelectLocal>
              </Form.Item>
            </Col>
            <Access permission="修改用户">
              <Col>
                <Button type="primary" onClick={() => editFn()}>
                  新增
                </Button>
              </Col>
            </Access>

            <Col>
              <Button type="primary" onClick={onSearch}>
                查询
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={onReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <Table
        rowKey={(record) => record?.key}
        loading={getListRequest?.loading}
        columns={renderColumns?.columns}
        dataSource={list}
        pagination={pages}
        bordered
        scroll={{
          x: renderColumns?.tableWidth,
          y: renderColumns?.tableHeight,
        }}
        onChange={pageChange}
      />

      <Edit ref={editRef} setRefreshDeps={setRefreshDeps} />
    </Space>
  );
};

export default User;
