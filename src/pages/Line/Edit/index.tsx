import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Spin, Input, message } from 'antd';
import { useToggle } from 'react-use';
import { CommonModal } from '@/components';
import { useRequest } from 'ahooks';
import LineService from '@/services/line';
import { SelectLocal } from '@/components';

interface LineEditProps {
  setRefreshDeps?: () => void;
}

const LineEdit = forwardRef(({ setRefreshDeps }: LineEditProps, parentRef) => {
  const [visible, setVisible] = useToggle(false);
  const [form] = Form.useForm();
  const lineId = Form.useWatch('lineId', form);
  const [customerList, setCustomerList] = useState<any[]>([]);

  useImperativeHandle(parentRef, () => ({
    init: ({ id }) => {
      setVisible();
      if (id) {
        getDetailRequest.run(id);
      }
      getCustomerRequest.run();
    },
  }));

  const getCustomerRequest = useRequest(LineService.getAllCustomer, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
      setCustomerList(data?.data);
    },
  });

  const getDetailRequest = useRequest(LineService.detail, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
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
    console.log(_value);
    updateRequest.run({
      ..._value,
    });
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
          <Form.Item label="客户" name="userId">
            <SelectLocal
              list={customerList}
              selectKey="userId"
              selectLabel="userName"
            />
          </Form.Item>
          <Form.Item label="ip地址" name="ipAddr" required>
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </CommonModal>
  );
});

export default LineEdit;
