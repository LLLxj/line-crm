import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Spin, Input, message } from 'antd';
import { useToggle } from 'react-use';
import { CommonModal } from '@/components';
import { useRequest } from 'ahooks';
import CustomerService from '@/services/customer';

interface ChangePwdProps {
  setRefreshDeps?: () => void;
}

const ChangePwd = forwardRef(
  ({ setRefreshDeps }: ChangePwdProps, parentRef) => {
    const [visible, setVisible] = useToggle(false);
    const [form] = Form.useForm();
    const userId = Form.useWatch('userId', form);

    useImperativeHandle(parentRef, () => ({
      init: ({ id }: { id?: number }) => {
        setVisible();
        if (id) {
          getDetailRequest.run(id);
        }
      },
    }));

    const getDetailRequest = useRequest(CustomerService.detail, {
      manual: true,
      debounceWait: 500,
      onSuccess: (data) => {
        console.log(data);
        form.setFieldsValue({
          userId: data?.data?.userId,
          oldPwdEncrypt: data?.data?.msisdn,
        });
      },
    });

    const updateRequest = useRequest(CustomerService.updatePassword, {
      manual: true,
      debounceWait: 500,
      onSuccess: (data) => {
        console.log(data);
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
        oldPwdEncrypt: '88888888',
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
        title="修改密码"
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
            <Form.Item name="userId" hidden />
            <Form.Item name="oldPwdEncrypt" hidden />
            <Form.Item label="密码" name="newPwdEncrypt" required>
              <Input />
            </Form.Item>
            <Form.Item label="确认密码" name="confirmPwdEncrypt" required>
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </CommonModal>
    );
  },
);

export default ChangePwd;
