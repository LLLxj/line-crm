import React from 'react'
import { Row, Form, Input, Button } from 'antd'
import type { Dispatch } from 'umi';
import type { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import './index.less'
import * as CrytoJS from 'crypto-js'

interface LoginProps {
  dispatch: Dispatch;
}

const Login: React.FC<LoginProps> = ({
  dispatch
}) => {

  const [form] = Form.useForm();

  const submit = async () => {
    const _formData = await form.validateFields()
    console.log(_formData);
    dispatch({
      type: 'login/login',
      payload: {
        params: _formData,
        type: 'userinfo'
      }
    });
  }

  const encryptFn = () => {
    const key = CrytoJS.enc.Utf8.parse
  }

  return (
    <Row
      justify="center"
      align="middle"
      className='login__container'
    >
      <Form
        form={form}
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 18
        }}
      >
        <Form.Item
          label="手机号"
          name="msisdn"
          rules={[{
            required: true,
            message: '请输入手机号'
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="pwdEncrypt"
          rules={[{
            required: true,
            message: '请输入密码'
          }]}
        >
          <Input />
        </Form.Item>
        <Button
          onClick={submit}
        >
          登录
        </Button>
      </Form>
    </Row>
  );
}

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);