import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest, useSize } from 'ahooks';
import RoleService from '@/services/role';
import { usePages, useContainerSize } from '@/hooks';
import { Table, Form, Row, Col, Input, Button, Space } from 'antd';
import { CommonLayoutSpace } from '@/components';
import { countTableCellWidth } from '@/utils';
import Edit from './Edit';
import type { ModalInitRef } from '@/pages/type';
import { AES, enc } from 'crypto-js';
import Utf8 from 'crypto-js/enc-utf8';
import { useToggle } from 'react-use';
import { SelectLocal, Access } from '@/components';
import { useCommonList } from '@/hooks';

const Role: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState<number>();
  const [form] = Form.useForm();
  const { defaultPaegs, pages, setPages } = usePages();
  const [refreshDeps, setRefreshDeps] = useToggle(false);
  const { optionMap: statusOptionsMap } = useCommonList('状态');
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
  const searchColSpan = 6;
  const editRef = useRef<ModalInitRef>();

  const getListRequest = useRequest(RoleService.list, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      const _list = data?.data?.list?.map(
        (item: { roleId: any; isLock: 0 | 1; status: 0 | 1 }) => {
          return {
            ...item,
            key: item?.roleId,
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

  const usefulRequest = useRequest(RoleService.normal, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      setRefreshDeps();
    },
  });

  const disabledRequest = useRequest(RoleService.disabled, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      setRefreshDeps();
    },
  });

  useEffect(() => {
    getListFn();
    // const plaintext = 'string';
    // const secretKey = 'lqgh6wk83975l826';
    // console.log();
    // const result = '1ANeRJ1Oq+zwGsRYmf2upQ==';
    // const ciphertext = AES.encrypt(plaintext, secretKey).toString();
    // console.log(ciphertext);
    // console.log(result === ciphertext);
    // var bytes = AES.encrypt(result, secretKey);
    // console.log(bytes);
    // console.log(plaintext === ciphertext);
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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'statusLabel',
    },
    {
      title: '操作',
      dataIndex: 'handle',
      fixed: 'right',
      render: (_, record: any) => {
        return (
          <>
            {record.status ? (
              <Access permission="修改角色状态">
                <Button type="link" onClick={() => disHandle(record.roleId)}>
                  禁用
                </Button>
              </Access>
            ) : (
              <Access permission="修改角色状态">
                <Button type="link" onClick={() => useHandle(record.roleId)}>
                  启用
                </Button>
              </Access>
            )}
            <Access permission="获取角色详情">
              <Button type="link" onClick={() => editFn(record.roleId)}>
                编辑
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
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Row gutter={[20, 20]}>
            <Col key="userName">
              <Form.Item label="角色名称" name="roleName">
                <Input />
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
            <Access permission="新增角色">
              <Col key="add">
                <Button type="primary" onClick={() => editFn()}>
                  新增
                </Button>
              </Col>
            </Access>

            <Col key="search">
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

export default Role;
