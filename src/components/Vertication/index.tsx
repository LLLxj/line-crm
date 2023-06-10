import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { Form, Button, Spin, message, Input } from 'antd';
import { useToggle } from 'react-use';
import { CommonModal } from '@/components';
import { useRequest } from 'ahooks';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import SystemService from '@/services/system';
import { SelectLocal, AutoComplete, CommonUpload } from '@/components';
import type { Dispatch } from 'umi';

interface VerticationProps {
  setRefreshDeps?: () => void;
  visible: boolean;
  setVisible: () => void;
  userInfo: any;
  dispatch: Dispatch;
}

const Vertication = ({
  setRefreshDeps,
  visible,
  setVisible,
  userInfo: info,
  dispatch,
}: VerticationProps) => {
  // const [visible, setVisible] = useToggle(false)
  const [form] = Form.useForm();
  const { user: userInfo } = info;

  const getBusinessRequest = useRequest(SystemService.getAllBusiness, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const verticationRequest = useRequest(SystemService.vertication, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success('操作成功');
      setVisible();
      if (dispatch) {
        dispatch({
          type: 'login/getUserInfo',
          payload: {},
        });
      }
    },
  });

  const getFrontInfo = (data: any) => {
    console.log(data);
    form.setFieldsValue({
      userName: data?.userName,
      encryptIdCard: data?.idCard,
      frontUrl: data?.url,
      frontPath: data?.path,
    });
  };

  const deleteCallback = () => {
    form.setFieldsValue({
      userName: undefined,
      encryptIdCard: undefined,
      frontUrl: undefined,
      frontPath: undefined,
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

  const onCancel = () => {
    setVisible();
    form.resetFields();
  };

  const submit = async () => {
    const _value = await form.validateFields();
    console.log(_value);
    verticationRequest.run(_value);
  };

  const renderLoading = () => {
    const _loading = [verticationRequest?.loading]?.includes(true);
    return _loading;
  };

  return (
    <CommonModal
      title="验证"
      visible={visible}
      getContainer={document.body}
      closable={false}
      footer={[
        <Button
          key="submit"
          type="primary"
          disabled={renderLoading()}
          onClick={submit}
        >
          验证
        </Button>,
      ]}
    >
      <Spin spinning={renderLoading()}>
        <Form
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item name="userId" hidden />
          <Form.Item name="approveId" hidden />
          <Form.Item label="身份证正面照" name="frontUrl">
            <CommonUpload
              asyncHandle={SystemService.uploadFront}
              asyncParams={userInfo?.userId}
              uploadCallback={getFrontInfo}
              deleteCallback={deleteCallback}
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
        </Form>
      </Spin>
    </CommonModal>
  );
};

export default connect(({ global, settings, login }: ConnectState) => ({
  userInfo: login.userInfo,
}))(Vertication);
