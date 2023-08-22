import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest } from 'ahooks';
import LineService from '@/services/line';
import { usePages } from '@/hooks';
import { Table, Form, Row, Col, Input, Button } from 'antd';
import { CommonLayoutSpace } from '@/components';
import { countTableCellWidth, uploadBlob } from '@/utils';
import Edit from './Edit';
import type { ModalInitRef } from '@/pages/type';
import List from './index';

const Customer: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState<number>();
  const [form] = Form.useForm();
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

  const getListRequest = useRequest(LineService.customerList, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      const _list = data?.data?.list?.map(
        (item: { lineId: any; status: 0 | 1 }) => {
          return {
            ...item,
            key: item?.lineId,
            statusLabel: formatMap['status']?.[item?.status],
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

  const exportRequest = useRequest(LineService.exportCustomer, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      window.open(data?.data, '_blank');
    },
  });

  useEffect(() => {
    getListFn();
  }, []);

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

  const editFn = () => {
    editRef?.current?.init({});
  };

  const exportFn = () => {
    exportRequest.run({});
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
          {/* <Col>
            <Button
              type="primary"
              onClick={editFn}
            >
              新增
            </Button>
          </Col> */}
          <Col>
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={exportFn}
              loading={exportRequest?.loading}
            >
              导出
            </Button>
          </Col>
        </Row>
      </Form>
      <List
        list={list}
        pages={pages}
        loading={getListRequest?.loading}
        freshCallback={getListFn}
        resource="customer"
      />
      <Edit ref={editRef} successCallback={getListFn} />
    </div>
  );
};

export default Customer;
