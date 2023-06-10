import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest, useSize } from 'ahooks';
import PermissionService from '@/services/permission';
import { usePages, useContainerSize } from '@/hooks';
import { Table, Form, Row, Col, Input, Button, Space } from 'antd';
import { CommonLayoutSpace, Access } from '@/components';
import { countTableCellWidth } from '@/utils';
import Edit from './Edit';
import type { ModalInitRef } from '@/pages/type';
import { useToggle } from 'react-use';

const Permission: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState<number>();
  const [form] = Form.useForm();
  const [refreshDeps, setRefreshDeps] = useToggle(false);
  const { defaultPaegs, pages, setPages } = usePages();
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

  const getListRequest = useRequest(PermissionService.list, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      const _list = data?.data?.list?.map((item: { permId: any }) => {
        return {
          ...item,
          key: item?.permId,
        };
      });
      setPages({
        ...pages,
        total: data?.data?.totalCount,
      });
      setList(_list);
    },
  });

  const deleteRequest = useRequest(PermissionService.delete, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      onReset();
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
      // pageSize: 20,
      // pageNum: 1
    });
  };

  const onSearch = async () => {
    const _formData = await form.getFieldsValue();
    getListFn(_formData);
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

  const deleteHandle = (_id: number) => {
    deleteRequest.run(_id);
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
      title: '权限名称',
      dataIndex: 'permName',
    },
    {
      title: '权限编码',
      dataIndex: 'perms',
    },
    {
      title: '操作',
      dataIndex: 'handle',
      fixed: 'right',
      render: (_, record: any) => {
        return (
          <>
            <Access permission="更新权限">
              <Button type="link" onClick={() => editFn(record.permId)}>
                编辑
              </Button>
            </Access>
            <Access permission="删除权限">
              <Button type="link" onClick={() => deleteHandle(record.permId)}>
                删除
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
    const _tableHeight = height - 96 - _searchContainerHeight - 200;
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
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Row gutter={[20, 20]}>
            <Access permission="新增权限">
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

export default Permission;
