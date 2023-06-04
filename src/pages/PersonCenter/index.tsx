import React, { useEffect } from 'react';
import { Form, Row, Input } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import CustomerService from '@/services/customer';
import { useRequest } from 'ahooks';

interface PersonCenterProps {
  userInfo: any;
}

const PersonCenter: React.FC<PersonCenterProps> = ({ userInfo }) => {
  console.log(userInfo);
  const {
    user: { userId },
  } = userInfo;

  const [form] = Form.useForm();

  const getInfoRequest = useRequest(CustomerService.info, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    if (userId) {
      getInfoRequest.run();
    }
  }, []);

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
        <Form.Item label="用户名" name="userName">
          <Input />
        </Form.Item>
        <Form.Item label="手机号" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="身份证" name="idCard">
          <Input />
        </Form.Item>
        <Form.Item label="是否实名认证" name="verify">
          <Input />
        </Form.Item>
        <Form.Item label="身份证正面照" name="frontPath">
          <Input />
        </Form.Item>
        <Form.Item label="身份证背面照" name="backPath">
          <Input />
        </Form.Item>
        <Form.Item label="个人照" name="personPath">
          <Input />
        </Form.Item>
      </Form>
    </Row>
  );
};

export default connect(({ login }: ConnectState) => ({
  userInfo: login.userInfo,
}))(PersonCenter);
