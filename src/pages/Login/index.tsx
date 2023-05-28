import React, { useState } from 'react'
import { Row, Form, Input, Button, Tabs, Col } from 'antd'
import type { Dispatch } from 'umi';
import type { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import './index.less'
import * as CrytoJS from 'crypto-js'
import type { HandleType } from './type'
import { UserOutlined, PhoneOutlined } from '@ant-design/icons'

interface LoginProps {
  dispatch: Dispatch;
}

const Login: React.FC<LoginProps> = ({
  dispatch
}) => {

  const [form] = Form.useForm();
  const [activeKey, setActivekey] = useState<HandleType>('登录')
  const items = [
    { label: '登录', key: '登录' },
    { label: '注册', key: '注册' },
  ]

  const submit = async () => {
    const _formData = await form.validateFields()
    console.log(_formData);
    const map = {
      '登录': 'login/login',
      '注册': 'login/register'
    }
    dispatch({
      type: map?.[activeKey],
      payload: {
        params: _formData,
        type: 'userinfo'
      }
    });
  }

  const encryptFn = () => {
    const key = CrytoJS.enc.Utf8.parse
  }

  const onChange = (value: HandleType) => {
    console.log(value)
    setActivekey(value);
  }

  return (
    <Row
      justify="center"
      align="middle"
      className='login__container'
    >
      <Row
        className='form'
      >
        <Col
          span={24}
        >
          <Tabs
            activeKey={activeKey}
            items={items}
            onChange={onChange}
            centered
          />
        </Col>
        <Col
          span={24}
        >
          <Form
            form={form}
            // labelCol={{
            //   span: 6
            // }}
            wrapperCol={{
              span: 24
            }}
          >
            {
              activeKey === '登录'
                ? <>
                    <Form.Item
                      name="msisdn"
                      rules={[{
                        required: true,
                        message: '请输入手机号'
                      }]}
                    >
                      <Input
                        addonBefore={<UserOutlined />}
                      />
                    </Form.Item>
                    <Form.Item
                      // label="密码"
                      name="pwdEncrypt"
                      rules={[{
                        required: true,
                        message: '请输入密码'
                      }]}
                    >
                      <Input
                        addonBefore={<PhoneOutlined />}
                      />
                    </Form.Item>
                  </>
                : <>
                    <Form.Item
                      name="userName"
                      rules={[{
                        required: true,
                        message: '请输入用户名'
                      }]}
                    >
                      <Input
                        addonBefore={<UserOutlined />}
                      />
                    </Form.Item>
                    <Form.Item
                      name="msisdn"
                      rules={[{
                        required: true,
                        message: '请输入手机号'
                      }]}
                    >
                      <Input
                        addonBefore={<PhoneOutlined />}
                      />
                    </Form.Item>
                  </>
            }
            <Button
              type="primary"
              onClick={submit}
              block
            >
              登录
            </Button>
          </Form>
        </Col>
      </Row>
     
    </Row>
  );
}

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);