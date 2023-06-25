import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRequest, useSize } from 'ahooks';
import CustomerService from '@/services/customer';
import { usePages, useContainerSize } from '@/hooks';
import { Table, Form, Row, Col, Input, Button, message, Space } from 'antd';
import { CommonLayoutSpace, Access } from '@/components';
import { countTableCellWidth } from '@/utils';
import Edit from './Edit';
import type { ModalInitRef } from '@/pages/type';
import { useToggle } from 'react-use';
import { SelectLocal, CommonImage } from '@/components';
import { useCommonList } from '@/hooks';
import ChangePwd from './ChangePwd';
import { history } from 'umi';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
interface CustomerProps {
  userInfo: any;
}

const Customer: React.FC<CustomerProps> = ({ userInfo }) => {
  const [list, setList] = useState<any[]>([]);
  const [tableWidth, setTableWidth] = useState<number>();
  const [form] = Form.useForm();
  const { defaultPaegs, pages, setPages } = usePages();
  const [refreshDeps, setRefreshDeps] = useToggle(false);
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
  const changePwdRef = useRef<ModalInitRef>();
  const searchColSpan = 6;

  const getListRequest = useRequest(CustomerService.list, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
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

  const usefulRequest = useRequest(CustomerService.normal, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('操作成功');
      setRefreshDeps();
    },
  });

  const disabledRequest = useRequest(CustomerService.disabled, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('操作成功');
      setRefreshDeps();
    },
  });

  const unlockRequest = useRequest(CustomerService.unLock, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('操作成功');
      setRefreshDeps();
    },
  });

  const passRequest = useRequest(CustomerService.pass, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('操作成功');
      setRefreshDeps();
    },
  });

  const rejectRequest = useRequest(CustomerService.reject, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('操作成功');
      setRefreshDeps();
    },
  });

  const resetPwdRequest = useRequest(CustomerService.resetPassword, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('操作成功');
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

  const changePwdHandle = (_id?: number) => {
    changePwdRef?.current?.init({
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

  const passHandle = (_id: number) => {
    passRequest.run(_id);
  };

  const rejectHandle = (_id: number) => {
    rejectRequest.run(_id);
  };

  const resetPwdHandle = (_id: number) => {
    resetPwdRequest.run(_id);
  };

  const checkLine = (_record: any) => {
    history.push(
      `/line/business/list?userName=${_record?.userName}&userId=${_record?.userId}`,
    );
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
      title: '个人照',
      dataIndex: 'personPath',
      render: (_, record) => {
        return <CommonImage width={80} src={record?.personPath} />;
      },
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
      titleCol: 12,
      fixed: 'right',
      render: (_, record: any) => {
        return (
          <>
            {record.status ? (
              <Access permission="修改客户状态">
                <Button type="link" onClick={() => disHandle(record.userId)}>
                  禁用
                </Button>
              </Access>
            ) : (
              <Access permission="修改客户状态">
                <Button type="link" onClick={() => useHandle(record.userId)}>
                  启用
                </Button>
              </Access>
            )}
            {record?.isAudit === 0 &&
              record?.isUpload === 1 &&
              record?.verify === 0 && (
                <>
                  <Access permission="修改客户状态">
                    <Button
                      type="link"
                      onClick={() => passHandle(record.userId)}
                    >
                      通过
                    </Button>
                  </Access>
                  <Access permission="修改客户状态">
                    <Button
                      type="link"
                      onClick={() => rejectHandle(record.userId)}
                    >
                      驳回
                    </Button>
                  </Access>
                </>
              )}
            <Access permission="解锁客户">
              <Button type="link" onClick={() => unlockHandle(record.userId)}>
                解锁用户
              </Button>
            </Access>
            <Access permission="重置客户密码">
              <Button type="link" onClick={() => resetPwdHandle(record.userId)}>
                初始化密码
              </Button>
            </Access>
            <Access permission="客户修改密码">
              <Button
                type="link"
                onClick={() => changePwdHandle(record.userId)}
              >
                修改密码
              </Button>
            </Access>
            <Button type="link" onClick={() => checkLine(record)}>
              线路
            </Button>
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
    const _tableHeight = height - 96 - _searchContainerHeight - 240;
    return {
      columns: _columns,
      tableWidth: _tableWidth * 2,
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
                <Input />
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
            {/* <Col>
              <Button type="primary" onClick={() => editFn()}>
                新增
              </Button>
            </Col> */}
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
        bordered
        pagination={pages}
        scroll={{
          x: renderColumns?.tableWidth,
          y: renderColumns?.tableHeight,
        }}
        onChange={pageChange}
      />
      <Edit ref={editRef} />
      <ChangePwd ref={changePwdRef} />
    </Space>
  );
};

export default connect(({ login }: ConnectState) => ({
  userInfo: login.userInfo,
}))(Customer);
