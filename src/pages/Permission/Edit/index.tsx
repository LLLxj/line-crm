import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Spin, Input, message } from 'antd';
import { useToggle } from 'react-use';
import { CommonModal } from '@/components';
import { useRequest } from 'ahooks';
import PermissionService from '@/services/permission';

interface EditPermissionProps {
  setRefreshDeps?: () => void;
}

const EditPermission = forwardRef(
  ({ setRefreshDeps }: EditPermissionProps, parentRef) => {
    const [visible, setVisible] = useToggle(false);
    const [form] = Form.useForm();
    const permId = Form.useWatch('permId', form);

    useImperativeHandle(parentRef, () => ({
      init: ({ id }: { id: number }) => {
        setVisible();
        if (id) {
          getDetailRequest.run(id);
        }
      },
    }));

    const getDetailRequest = useRequest(PermissionService.detail, {
      manual: true,
      debounceWait: 500,
      onSuccess: (res) => {
        console.log(res);
        const { data } = res;
        form.setFieldsValue(data);
      },
    });

    const getUpdateRequestFn = () => {
      if (permId) {
        return PermissionService.update;
      } else {
        return PermissionService.save;
      }
    };

    const updateRequest = useRequest(getUpdateRequestFn(), {
      manual: true,
      debounceWait: 500,
      onSuccess: () => {
        message.success('操作成功');
        onCancel();
      },
    });

    const onCancel = () => {
      setVisible();
      form.resetFields();
      setRefreshDeps && setRefreshDeps();
    };

    const submit = async () => {
      const _value = await form.validateFields();
      console.log(_value);
      updateRequest.run({
        ..._value,
        roleIdList: [],
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
        title={permId ? '编辑' : '新增'}
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
            <Form.Item name="permId" hidden />
            <Form.Item
              label="权限名称"
              name="permName"
              rules={[
                {
                  required: true,
                  message: '请输入权限名称',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="权限编码"
              name="perms"
              rules={[
                {
                  required: true,
                  message: '请输入权限编码',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </CommonModal>
    );
  },
);

export default EditPermission;
