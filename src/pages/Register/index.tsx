import React, { useState, useMemo, useEffect } from 'react';
import { Segmented, Row, Form, Input, Button } from 'antd';
import SystemService from '@/services/system';
import { useRequest } from 'ahooks';
import { SelectLocal } from '@/components';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';

type StepType = '注册' | '验证' | '认证';

const Register: React.FC = () => {
  const [step, setStep] = useState<StepType>('注册');
  const [businessList, setBusinessList] = useState<any[]>([]);
  const [form] = Form.useForm();

  const getBusinessRequest = useRequest(SystemService.getAllBusiness, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const registerRequest = useRequest(SystemService.register, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    // getBusinessRequest.run()
  }, []);

  const onChange = (value: any) => {
    console.log(value);
    setStep(value);
  };

  const registerHandle = async () => {
    await form.validateFields();
    const formData = await form.getFieldsValue();
    registerRequest.run(formData);
  };

  const renderForm = useMemo(() => {
    switch (step) {
      case '注册':
        return (
          <>
            <Form.Item label="业务归属人" name="saleUserId">
              <SelectLocal
                list={businessList}
                selectKey="userId"
                selectLabel="userName"
              />
            </Form.Item>
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
            <Form.Item>
              <Button type="primary" onClick={registerHandle} block>
                注册
              </Button>
            </Form.Item>
          </>
        );
    }
  }, [step]);

  return (
    <div>
      <Row>
        <Segmented
          size="large"
          options={['注册', '验证', '认证']}
          value={step}
          onChange={onChange}
        />
      </Row>
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
          {renderForm}
        </Form>
      </Row>
    </div>
  );
};

export default Register;
