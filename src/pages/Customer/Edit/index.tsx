import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Form, Button, Spin, Input } from 'antd'
import { useToggle } from 'react-use'
import { CommonModal } from '@/components'
import { useRequest } from 'ahooks'
import CustomerService from '@/services/customer'

interface CustomerEditProps {
  setRefreshDeps?: () => void;
}

const CustomerEdit = forwardRef((
  {
    setRefreshDeps
  }: CustomerEditProps,
  parentRef
) => {

  const [visible, setVisible] = useToggle(false)
  const [form] = Form.useForm()
  const userId = Form.useWatch('userId', form)

  useImperativeHandle(
    parentRef,
    () => ({
      init: ({ id }) => {
        setVisible()
        if (id) {
          getDetailRequest.run(id)
        }
      }
    })
  )

  const getDetailRequest = useRequest(
    CustomerService.detail,
    {
      manual: true,
      debounceWait: 500,
       onSuccess: (data) => {
        console.log(data)
       }
     }
  )

  const getUpdateRequestFn = () => {
    if (userId) {
      return CustomerService.update
    } else {
      return CustomerService.save
    }
  }

  const updateRequest = useRequest(
    getUpdateRequestFn(),
    {
      manual: true,
      debounceWait: 500,
      onSuccess: (data) => {
        console.log(data)
        setRefreshDeps
          && setRefreshDeps()
      }
    }
  )

  const onCancel = () => {
    setVisible()
    form.resetFields()
  }

  const submit = async () => {
    const _value = await form.validateFields()
    console.log(_value)
    updateRequest.run({
      ..._value,
      roleIdList: []
    })
  }

  const renderLoading = () => {
    const _loading
      = [
          getDetailRequest?.loading,
          updateRequest?.loading
        ]?.includes(true)
    return _loading
  }

  return (
    <CommonModal
      title={userId ? '编辑' : '新增'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key='cancel'
          onClick={onCancel}
        >
          取消
        </Button>,
        <Button
          key='submit'
          type='primary'
          disabled={renderLoading()}
          onClick={submit}
        >
          确定
        </Button>
      ]}
    >
      <Spin
        spinning={renderLoading()}
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
            label="用户名"
            name="userName"
            required
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="msisdn"
            required
          >
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </CommonModal>
  );
})

export default CustomerEdit