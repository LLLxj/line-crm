import React, { useState, useMemo, useEffect } from 'react'
import { Segmented, Row, Form } from 'antd'
import SystemService from '@/services/system'
import { useRequest } from 'ahooks'

type StepType = '注册' | '验证' | '认证'

const Register: React.FC = () => {

  const [step, setStep] = useState<StepType>('注册')
  const [form] = Form.useForm()
  const onChange = (value: any) => {
    console.log(value);
  }

  useEffect(() => {
    geBusinessRequest.run()
  }, [])

  const geBusinessRequest = useRequest(
    SystemService.getAllBusiness,
    {
      manual: true,
      debounceWait: 500,
      onSuccess: (data) => {
        console.log(data)
      }
    }
  )

  const renderForm = useMemo(() => {
    switch (step) {
      case '注册':
        return (
          <Form.Item>

          </Form.Item>
        )
    }
  }, [step])

  return (
    <Row>
      <Segmented
        size="large"
        options={[
          '注册',
          '验证',
          '认证',
        ]}
        value={step}
        onChange={onChange}
      />
       <Form
        form={form}
        labelCol={{
          span: 10
        }}
        wrapperCol={{
          span: 14
        }}
      >
        { renderForm }
      </Form>
    </Row>
  );
}

export default Register