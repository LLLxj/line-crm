import React, { useState, useMemo, useEffect } from 'react';
import { Segmented, Row, Form, Input, Button } from 'antd';
import SystemService from '@/services/system';
import { useRequest } from 'ahooks';
import { SelectLocal, AutoComplete, CommonUpload } from '@/components';
import type { UserInfo } from './type';

type StepType = '注册' | '验证' | '认证';

const Register: React.FC = () => {
  const [step, setStep] = useState<StepType>('注册');
  const [businessList, setBusinessList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState<UserInfo>();

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
      setUserInfo(data?.data);
      setStep('验证');
    },
  });

  const verticationRequest = useRequest(SystemService.vertication, {
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

  const verficationHandle = async () => {
    await form.validateFields();
    const formData = await form.getFieldsValue();
    verticationRequest.run({
      ...formData,
      ...userInfo,
    });
  };

  const getFrontInfo = (data: any) => {
    console.log(data);
    form.setFieldsValue({
      userName: data?.userName,
      encryptIdCard: data?.idCard,
      frontUrl: data?.url,
      frontPath: data?.path,
    });
  };

  const getBackInfo = (data: any) => {
    console.log(data);
    form.setFieldsValue({
      backUrl: data?.url,
      backPath: data?.path,
    });
  };

  const getPersonInfo = (data: any) => {
    console.log(data);
    form.setFieldsValue({
      personUrl: data?.url,
      personPath: data?.path,
    });
  };

  const renderForm = useMemo(() => {
    switch (step) {
      case '注册':
        return (
          <>
            <Form.Item label="业务归属人" name="saleUserId">
              <AutoComplete
                asyncHandle={SystemService.getAllBusiness}
                asyncKeyword="userName"
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
      case '验证':
        return (
          <>
            <Form.Item name="userId" hidden />
            <Form.Item name="approveId" hidden />
            <Form.Item label="身份证正面照" name="frontUrl">
              <CommonUpload
                asyncHandle={SystemService.uploadFront}
                asyncParams={userInfo?.userId}
                uploadCallback={getFrontInfo}
              />
            </Form.Item>
            <Form.Item name="frontUrl" hidden />
            <Form.Item name="frontPath" hidden />
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
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="身份证号"
              name="encryptIdCard"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item label="身份证背面" name="frontUrl">
              <CommonUpload
                asyncHandle={SystemService.upload}
                asyncParams={userInfo?.userId}
                uploadCallback={getBackInfo}
              />
            </Form.Item>
            <Form.Item name="backUrl" hidden />
            <Form.Item name="backPath" hidden />
            <Form.Item label="本人照片" name="frontUrl">
              <CommonUpload
                asyncHandle={SystemService.upload}
                asyncParams={userInfo?.userId}
                uploadCallback={getPersonInfo}
              />
            </Form.Item>
            <Form.Item name="personUrl" hidden />
            <Form.Item name="personPath" hidden />
            <Form.Item>
              <Button type="primary" onClick={verficationHandle} block>
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
          block
          // size="large"
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
