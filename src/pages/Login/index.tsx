import React, { useState, useEffect } from 'react';
import { Row, Form, Input, Button, Tabs, Col, message } from 'antd';
import type { Dispatch } from 'umi';
import type { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import './index.less';
import * as CrytoJS from 'crypto-js';
import type { HandleType } from './type';
import { KeyOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { AutoComplete } from '@/components';
import SystemService from '@/services/system';
import { useRequest } from 'ahooks';

interface LoginProps {
  dispatch: Dispatch;
}

const Login: React.FC<LoginProps> = ({ dispatch }) => {
  const [form] = Form.useForm();
  const [activeKey, setActivekey] = useState<HandleType>('登录');
  const items = [
    { label: '登录', key: '登录' },
    { label: '注册', key: '注册' },
  ];

  const registerRequest = useRequest(SystemService.register, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('注册成功，请登录');
      setTimeout(() => {
        toLogin();
      }, 1000);
    },
  });

  const toLogin = () => {
    setActivekey('登录');
    form.resetFields();
  };

  const submit = async () => {
    const _formData = await form.validateFields();
    if (dispatch) {
      dispatch({
        type: 'login/login',
        payload: {
          params: _formData,
          type: 'userinfo',
        },
      });
    }
  };

  const encryptFn = () => {
    const key = CrytoJS.enc.Utf8.parse;
  };

  const onChange = (value: HandleType) => {
    form.resetFields();
    setActivekey(value);
  };

  const register = async () => {
    await form.validateFields();
    const formData = await form.getFieldsValue();
    registerRequest.run(formData);
  };

  return (
    <Row justify="center" align="middle" className="login__container">
      <Row className="form">
        <Col span={24}>
          <Tabs
            activeKey={activeKey}
            items={items}
            onChange={onChange}
            centered
          />
        </Col>
        <Col span={24}>
          <Form
            form={form}
            // labelCol={{
            //   span: 6
            // }}
            wrapperCol={{
              span: 24,
            }}
          >
            {activeKey === '登录' ? (
              <>
                <Form.Item
                  name="msisdn"
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号',
                    },
                  ]}
                >
                  <Input
                    addonBefore={<PhoneOutlined />}
                    placeholder="请输入手机号"
                  />
                </Form.Item>
                <Form.Item
                  // label="密码"
                  name="pwdEncrypt"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码',
                    },
                  ]}
                >
                  <Input.Password
                    addonBefore={<KeyOutlined />}
                    placeholder="请输入密码"
                  />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名',
                    },
                  ]}
                >
                  <Input
                    addonBefore={<UserOutlined />}
                    placeholder="请输入用户名"
                  />
                </Form.Item>
                <Form.Item
                  name="msisdn"
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号',
                    },
                  ]}
                >
                  <Input
                    addonBefore={<PhoneOutlined />}
                    placeholder="请输入手机号"
                  />
                </Form.Item>
                <Form.Item name="saleUserId">
                  <AutoComplete
                    asyncHandle={SystemService.getAllBusiness}
                    asyncKeyword="userName"
                    selectKey="userId"
                    selectLabel="userName"
                    placeholder="请选择业务员"
                  />
                </Form.Item>
              </>
            )}
            {activeKey === '登录' ? (
              <Button type="primary" onClick={submit} block>
                登录
              </Button>
            ) : (
              <Button type="primary" onClick={register} block>
                注册
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </Row>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
