import React, { useEffect } from 'react';
import { Form, Row, Input, Button, message } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import CustomerService from '@/services/customer';
import { useRequest } from 'ahooks';
import type { Dispatch } from 'umi';
import { AutoComplete } from '@/components';
import SystemService from '@/services/system';

interface UpdateBelongProps {
  userInfo: any;
  dispatch: Dispatch;
}

const UpdateBelong: React.FC<UpdateBelongProps> = ({
  userInfo: info,
  dispatch,
}) => {
  const [form] = Form.useForm();

  const updateRequest = useRequest(CustomerService.updateBelong, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('操作成功，请重新登录');
      if (dispatch) {
        setTimeout(() => {
          dispatch({
            type: 'login/login',
          });
        }, 1000);
      }
    },
  });

  const submit = async () => {
    const { saleUserId } = await form.validateFields();
    updateRequest.run(saleUserId);
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
        <Form.Item
          label="所属管理员"
          name="saleUserId"
          rules={[
            {
              required: true,
              message: '请选择',
            },
          ]}
        >
          <AutoComplete
            asyncHandle={SystemService.getAllBusiness}
            asyncKeyword="userName"
            selectKey="userId"
            selectLabel="userName"
            placeholder="请选择所属管理员"
          />
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
}))(UpdateBelong);
