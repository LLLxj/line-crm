import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Spin, Input, message } from 'antd';
import { useToggle } from 'react-use';
import { CommonModal } from '@/components';
import { useRequest } from 'ahooks';
import RoleService from '@/services/role';
import PermissionService from '@/services/permission';
import { SelectLocal } from '@/components';
import LineService from '@/services/line';

interface BindDepsOrUserProps {
  setRefreshDeps?: () => void;
}

const RoleEdit = forwardRef(
  ({ setRefreshDeps }: BindDepsOrUserProps, parentRef) => {
    const [visible, setVisible] = useToggle(false);
    const [form] = Form.useForm();
    const roleId = Form.useWatch('roleId', form);
    const [permissionList, setPermissionList] = useState<any[]>([]);
    const [customerList, setCustomerList] = useState<any[]>([]);

    useImperativeHandle(parentRef, () => ({
      init: ({ id }: { id: number }) => {
        setVisible();
        getRolelist.run();
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

    const getDetailRequest = useRequest(RoleService.detail, {
      manual: true,
      debounceWait: 500,
      onSuccess: (data) => {
        form.setFieldsValue(data?.data);
      },
    });

    const getRolelist = useRequest(PermissionService.all, {
      manual: true,
      debounceWait: 500,
      onSuccess: (data) => {
        const _permissionList = data?.data?.length ? data?.data : [];
        setPermissionList(_permissionList);
      },
    });

    const getUpdateRequestFn = () => {
      if (roleId) {
        return RoleService.update;
      } else {
        return RoleService.save;
      }
    };

    const updateRequest = useRequest(getUpdateRequestFn(), {
      manual: true,
      debounceWait: 500,
      onSuccess: () => {
        message.success('操作成功');
        setRefreshDeps && setRefreshDeps();
        onCancel();
      },
    });

    const onCancel = () => {
      setVisible();
      form.resetFields();
    };

    const submit = async () => {
      const formData = await form.validateFields();
      updateRequest.run({
        ...formData,
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
        title={roleId ? '编辑' : '新增'}
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
            <Form.Item name="roleId" hidden />
            <Form.Item
              label="角色名称"
              name="roleName"
              rules={[
                {
                  required: true,
                  message: '请填写角色名称',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="角色编号"
              name="roleCode"
              rules={[
                {
                  required: true,
                  message: '请填写角色编号',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="权限" name="permIdList">
              <SelectLocal
                list={permissionList}
                mode="multiple"
                selectKey="permId"
                selectLabel="permName"
              />
            </Form.Item>

            <Form.Item label="备注" name="remark">
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </CommonModal>
    );
  },
);

export default RoleEdit;
