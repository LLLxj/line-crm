import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest } from 'ahooks';
import PermissionService from '@/services/permission';
import { usePages } from '@/hooks';
import { Table, Form, Row, Col, Input, Button } from 'antd';
import { CommonLayoutSpace } from '@/components';
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
      console.log(data);
      const _list = data?.data?.list?.map(
        (item: { permId: any; isLock: 0 | 1; status: 0 | 1 }) => {
          return {
            ...item,
            key: item?.permId,
          };
        },
      );
      setPages({
        ...pages,
        total: data?.totalCount,
      });
      setList(_list);
    },
  });

  const deleteRequest = useRequest(PermissionService.delete, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
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
      // pageSize: 20,
      // pageNum: 1
    });
  };

  const onSearch = async () => {
    const _formData = await form.getFieldsValue();
    getListFn(_formData);
  };

  const renderColumns = useMemo(() => {
    const _columns = columns?.map((item) => {
      const _width = countTableCellWidth({
        title: item?.title,
        titleCol: item?.titleCol,
      });
      return {
        title: item?.title,
        dataIndex: item?.dataIndex,
        width: _width,
        render: item?.render,
        // (_, record) => {
        //   return (
        //     <span>{ record?.[item?.dataIndex] || '--' } </span>
        //   )
        // }
      };
    });
    const _tableWidth = _columns
      ?.map((item) => item?.width)
      ?.reduce((prev, cur) => {
        return prev + cur;
      }, 0);
    setTableWidth(_tableWidth);
    return _columns;
  }, []);

  const editFn = (_id?: number) => {
    editRef?.current?.init({
      id: _id,
    });
  };

  const deleteHandle = (_id: number) => {
    deleteRequest.run(_id);
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
      render: (_, record: any) => {
        return (
          <>
            <Button type="link" onClick={() => editFn(record.permId)}>
              编辑
            </Button>
            <Button type="link" onClick={() => deleteHandle(record.permId)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
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
          <Col>
            <Form.Item label="用户名" name="userName">
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" onClick={() => editFn()}>
              新增
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey={(record) => record?.key}
        loading={getListRequest?.loading}
        columns={columns}
        dataSource={list}
        bordered
        scroll={{
          x: tableWidth,
        }}
      />
      <Edit ref={editRef} setRefreshDeps={setRefreshDeps} />
    </div>
  );
};

export default Permission;
