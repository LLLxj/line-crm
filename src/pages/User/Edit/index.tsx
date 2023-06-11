import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Spin, Input, message } from 'antd';
import { useToggle } from 'react-use';
import { CommonModal } from '@/components';
import { useRequest } from 'ahooks';
import UserService from '@/services/user';
import RoleService from '@/services/role';
import { SelectLocal } from '@/components';
interface BindDepsOrUserProps {
  setRefreshDeps?: () => void;
}

const UserUpdate = forwardRef(
  ({ setRefreshDeps }: BindDepsOrUserProps, parentRef) => {
    const [visible, setVisible] = useToggle(false);
    const [form] = Form.useForm();
    const userId = Form.useWatch('userId', form);
    const [roleList, setRoleList] = useState<any[]>([]);

    useImperativeHandle(parentRef, () => ({
      init: ({ id }: { id: number }) => {
        setVisible();
        getRolesRequest.run({
          pageNum: 1,
          pageSize: 1000,
        });
        if (id) {
          getDetailRequest.run(id);
        }
      },
    }));

    const getDetailRequest = useRequest(UserService.detail, {
      manual: true,
      debounceWait: 500,
      onSuccess: (res) => {
        console.log(res);
        const { data } = res;
        form.setFieldsValue(data);
      },
    });

    const getRolesRequest = useRequest(RoleService.list, {
      manual: true,
      debounceWait: 500,
      onSuccess: (res) => {
        setRoleList(res?.data?.list);
      },
    });

    const getUpdateRequestFn = () => {
      if (userId) {
        return UserService.update;
      } else {
        return UserService.save;
      }
    };

    const updateRequest = useRequest(getUpdateRequestFn(), {
      manual: true,
      debounceWait: 500,
      onSuccess: (data) => {
        message.success('操作成功');
        onCancel();
      },
    });

    const onCancel = () => {
      setVisible();
      form.resetFields();
      setRoleList([]);
      setRefreshDeps && setRefreshDeps();
    };

    const submit = async () => {
      const _value = await form.validateFields();
      console.log(_value);
      updateRequest.run(_value);
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
        title={userId ? '编辑' : '新增'}
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
            <Form.Item
              label="用户名"
              name="userName"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="手机号"
              name="msisdn"
              rules={[
                {
                  required: true,
                  message: '请输入手机号',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="角色" name="roleIdList">
              <SelectLocal
                list={roleList}
                mode="multiple"
                selectKey="roleId"
                selectLabel="roleCode"
              />
            </Form.Item>
          </Form>
        </Spin>
      </CommonModal>
    );
  },
);

export default UserUpdate;
