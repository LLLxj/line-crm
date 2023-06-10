import React, { useEffect } from 'react';
import { Form, Row, Input, Button, message } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import CustomerService from '@/services/customer';
import { useRequest } from 'ahooks';
import { useCommonList } from '@/hooks';
import { SelectLocal } from '@/components';
import type { Dispatch } from 'umi';

interface UpdatePasswordProps {
  userInfo: any;
  dispatch: Dispatch;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({
  userInfo: info,
  dispatch,
}) => {
  const [form] = Form.useForm();

  const updateRequest = useRequest(CustomerService.updatePassword, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
      message.success('操作成功，请重新登录');
      if (dispatch) {
        setTimeout(() => {
          dispatch({
            type: 'login/logout',
          });
        }, 1000);
      }
    },
  });

  useEffect(() => {
    if (info?.user?.userId) {
      form.setFieldsValue({
        userId: info?.user?.userId,
      });
    }
  }, []);

  const submit = async () => {
    const formData = await form.validateFields();
    updateRequest.run(formData);
  };

  return (
    <Row>
      <Form
        form={form}
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 14,
        }}
      >
        <Form.Item name="userId" hidden />
        <Form.Item label="旧密码" name="oldPwdEncrypt" required>
          <Input />
        </Form.Item>
        <Form.Item label="新密码" name="newPwdEncrypt" required>
          <Input />
        </Form.Item>
        <Form.Item label="确认密码" name="confirmPwdEncrypt" required>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={submit} block>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};

export default connect(({ login }: ConnectState) => ({
  userInfo: login.userInfo,
}))(UpdatePassword);
