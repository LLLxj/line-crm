import React, { useEffect } from 'react';
import { Form, Row, Input } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import CustomerService from '@/services/customer';
import { useRequest } from 'ahooks';
import { useCommonList } from '@/hooks';
import { SelectLocal } from '@/components';

interface PersonCenterProps {
  userInfo: any;
}

const PersonCenter: React.FC<PersonCenterProps> = ({ userInfo }) => {
  console.log(userInfo);
  const {
    user: { userId },
  } = userInfo;

  const [form] = Form.useForm();
  const frontPath = Form.useWatch('frontPath', form);
  const backPath = Form.useWatch('backPath', form);
  const personPath = Form.useWatch('personPath', form);
  const { optionMap } = useCommonList('锁定');

  const getInfoRequest = useRequest(CustomerService.info, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
      form.setFieldsValue(data?.data);
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
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="手机号" name="phone">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="身份证" name="idCard">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="是否实名认证" name="verify">
          <SelectLocal
            disabled={true}
            list={optionMap?.options}
            selectKey="value"
            selectLabel="label"
          />
        </Form.Item>
        <Form.Item label="身份证正面照" name="frontPath">
          <img src={frontPath} alt="" />
        </Form.Item>
        <Form.Item label="身份证背面照" name="backPath">
          <img src={backPath} alt="" />
        </Form.Item>
        <Form.Item label="个人照" name="personPath">
          <img src={personPath} alt="" />
        </Form.Item>
      </Form>
    </Row>
  );
};

export default connect(({ login }: ConnectState) => ({
  userInfo: login.userInfo,
}))(PersonCenter);
