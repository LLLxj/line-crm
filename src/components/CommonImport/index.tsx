import React, { useState } from 'react';
import { useToggle } from 'react-use';
import { Button, Form, Spin, message, notification } from 'antd';
import CommonUpload from '../Upload';
import { useRequest } from 'ahooks';
import { previewFileUrl } from '@/utils/previewFile';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CommonModal from '@/components/CommonModal';
import LineService from '@/services/line';
import { uploadBlob } from '@/utils';

interface CommonImportProps {
  resource: string;
  type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
  setRefreshDeps?: () => void;
  buttonLabel?: string;
}

const CommonImport: React.FC<CommonImportProps> = ({
  resource,
  type = 'primary',
  setRefreshDeps,
  buttonLabel = '导入',
}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useToggle(false);
  const [websocketLoading, setWebsocketLoading] = useToggle(false);
  const [fileList, setFileList] = useState<any[]>();

  const sourceRequestMap: Record<string, any> = {
    线路: {
      template: LineService.getTemplate,
      upload: LineService.import,
    },
  };

  const importRequest = useRequest(sourceRequestMap?.[resource].template, {
    manual: true,
    debounceWait: 500,
    onSuccess: (data: any) => {
      window.open(data?.data, '_blank');
    },
  });

  const getTemplateFn = () => {
    importRequest.run();
  };

  const handleCancel = () => {
    setVisible();
    form.resetFields();
  };

  const handleOk = async () => {
    await form.validateFields();
    const params = {
      module: module,
      filePath: fileList[0]?.ossUrlKey,
    };
    importRequest.run(params);
  };

  const getFileList = (value) => {
    setFileList(value);
  };

  const uploadCallback = () => {
    message.success('导入成功, 刷新列表查看数据');
  };

  const renderLoading = () => {
    const loadingStatus = [importRequest.loading, websocketLoading].includes(
      true,
    );
    return loadingStatus;
  };

  return (
    <>
      <Button
        type={type}
        onClick={() => {
          setVisible();
        }}
        className="m-r-r-20"
      >
        {buttonLabel}
      </Button>
      <CommonModal
        getContainer={false}
        title="导入"
        visible={visible}
        closable={true}
        maskClosable={false}
        onCancel={handleCancel}
        centered
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={renderLoading()}
            onClick={handleOk}
          >
            确定
          </Button>,
        ]}
      >
        <Spin spinning={renderLoading()}>
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
          >
            <Form.Item label="下载模板" name="">
              <Button onClick={getTemplateFn} loading={importRequest?.loading}>
                下载模板
              </Button>
            </Form.Item>
            <Form.Item
              label="文件"
              name="requiredList"
              required
              rules={[{ required: true, message: '请上传文件' }]}
            >
              <CommonUpload
                asyncHandle={sourceRequestMap?.[resource]?.upload}
                asyncParams={{}}
                uploadCallback={uploadCallback}
              />
            </Form.Item>
          </Form>
        </Spin>
      </CommonModal>
    </>
  );
};

export default CommonImport;
