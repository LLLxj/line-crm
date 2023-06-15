import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Spin, Input, message, DatePicker } from 'antd';
import { useToggle } from 'react-use';
import { CommonModal, AutoComplete } from '@/components';
import { useRequest } from 'ahooks';
import LineService from '@/services/line';
import { SelectLocal } from '@/components';
import moment from 'moment';

interface LineEditProps {
  setRefreshDeps?: () => void;
}

const LineEdit = forwardRef(({ setRefreshDeps }: LineEditProps, parentRef) => {
  const [visible, setVisible] = useToggle(false);
  const [form] = Form.useForm();
  const lineId = Form.useWatch('lineId', form);
  const userId = Form.useWatch('userId', form);
  const [customerList, setCustomerList] = useState<any[]>([]);
  const format = 'YYYY-MM-DD HH:mm:ss';

  useImperativeHandle(parentRef, () => ({
    init: ({ id }: { id: number }) => {
      setVisible();
      if (id) {
        getDetailRequest.run(id);
      }
    },
  }));

  const getCustomerRequest = useRequest(LineService.getAllCustomer, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      setCustomerList(data?.data);
    },
  });

  const getDetailRequest = useRequest(LineService.detail, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      form.setFieldsValue({
        ...data?.data,
        failureTime: moment(data?.data?.failureTime),
        // failureTime: undefined
      });
    },
  });

  const getUpdateRequestFn = () => {
    if (lineId) {
      return LineService.update;
    } else {
      return LineService.save;
    }
  };

  const updateRequest = useRequest(getUpdateRequestFn(), {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      message.success('操作成功');
      onCancel();
      setRefreshDeps && setRefreshDeps();
    },
  });

  const onCancel = () => {
    setVisible();
    form.resetFields();
  };

  const submit = async () => {
    const _value = await form.validateFields();
    const formData = {
      ..._value,
      failureTime: _value?.failureTime?.format(format),
    };
    console.log(formData);
    updateRequest.run(formData);
  };

  const renderLoading = () => {
    const _loading = [
      getDetailRequest?.loading,
      updateRequest?.loading,
    ]?.includes(true);
    return _loading;
  };

  return (
    <CommonModal
      title={lineId ? '编辑' : '新增'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={renderLoading()}
          onClick={submit}
        >
          确定
        </Button>,
      ]}
    >
      <Spin spinning={renderLoading()}>
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
        >
          <Form.Item name="lineId" hidden />
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
                userId: userId,
              }}
            />
          </Form.Item>

          <Form.Item
            label="ip（节点线路）"
            name="ipAddr"
            rules={[
              {
                required: true,
                message: '请输入ip（节点线路）',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="线路账号"
            name="lineAccount"
            rules={[
              {
                required: true,
                message: '请输入线路账号',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="线路密码"
            name="linePwd"
            rules={[
              {
                required: true,
                message: '请输入线路密码',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="失效时间"
            name="failureTime"
            rules={[
              {
                required: true,
                message: '请输入ip地址',
              },
            ]}
          >
            <DatePicker showTime />
          </Form.Item>
        </Form>
      </Spin>
    </CommonModal>
  );
});

export default LineEdit;
