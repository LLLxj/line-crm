import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest } from 'ahooks';
import LineService from '@/services/line';
import { usePages } from '@/hooks';
import { Table, Form, Row, Col, Input, Button } from 'antd';
import { CommonLayoutSpace } from '@/components';
import { countTableCellWidth, uploadBlob, download } from '@/utils';
import Edit from './Edit';
import type { ModalInitRef } from '@/pages/type';
import List from './index';
import { SelectLocal, AutoComplete, CommonImport } from '@/components';
import CustomerService from '@/services/customer';
import { useCommonList } from '@/hooks';
import { useToggle } from 'react-use';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Business: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState<number>();
  const [form] = Form.useForm();
  const [refreshDeps, setRefreshDeps] = useToggle(false);
  const { defaultPaegs, pages, setPages } = usePages();
  const { optionMap: statusOptionsMap } = useCommonList('状态');
  const location = useLocation();
  const searchParamsProps = new URLSearchParams(location.search);
  const [searchParams, setSearchParams] = useState<any>();
  // 获取具体的搜索参数值
  const userName = searchParamsProps.get('userName');
  const userId = searchParamsProps.get('userId');
  // const queryParams = queryString.parse(location.search);
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
  const [customerList, setCustomerList] = useState<any[]>([]);

  const getListRequest = useRequest(LineService.businessList, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      const _list = data?.data?.list?.map(
        (item: { lineId: any; isLock: 0 | 1; status: 0 | 1 }) => {
          return {
            ...item,
            key: item?.lineId,
            isLock: formatMap['isLock']?.[item?.isLock],
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

  const exportRequest = useRequest(LineService.exportBisiness, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      uploadBlob(data, '线路列表.xlsx');
    },
  });

  useEffect(() => {
    if (userName) {
      getListFn({
        userId: userId,
      });
      setSearchParams({
        userId,
      });
    }
  }, [userId]);

  const getListFn = (_params = {}) => {
    getListRequest.run({
      pageNum: pages?.current,
      pageSize: pages?.pageSize,
      ...searchParams,
      ..._params,
      // pageSize: 20,
      // pageNum: 1
    });
  };

  const onSearch = async () => {
    await form.validateFields();
    const _formData = await form.getFieldsValue();
    getListFn(_formData);
    setSearchParams(_formData);
  };

  const editFn = () => {
    editRef?.current?.init({});
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

  const exportFn = async () => {
    await form.validateFields();
    const formData = await form.getFieldsValue();
    exportRequest.run(formData);
  };

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
    <div>
      <Form
        form={form}
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 14,
        }}
      >
        <Row gutter={[20, 20]}>
          <Col span={searchColSpan}>
            <Form.Item
              label="客户"
              name="userId"
              rules={[
                {
                  required: true,
                  message: '请选择客户',
                },
              ]}
            >
              <AutoComplete
                asyncHandle={LineService.getAllCustomer}
                asyncKeyword="nameOrId"
                selectKey="userId"
                selectLabel="userName"
                valueExtension={{
                  userName,
                  userId,
                }}
              />
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
          <Col>
            <Button type="primary" onClick={editFn}>
              新增
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={exportFn}>
              导出
            </Button>
          </Col>
          <Col>
            <CommonImport
              resource="线路"
              buttonLabel="批量导入"
              setRefreshDeps={setRefreshDeps}
            />
          </Col>
        </Row>
      </Form>
      <List
        freshCallback={() => getListFn({})}
        list={list}
        pages={pages}
        loading={getListRequest?.loading}
      />
      <Edit ref={editRef} setRefreshDeps={setRefreshDeps} />
    </div>
  );
};

export default Business;
