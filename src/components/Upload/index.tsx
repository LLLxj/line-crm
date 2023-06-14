/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Upload, Button, Spin, message } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import SystemService from '@/services/system';

interface CommonUploadButtonProps extends UploadProps {
  resourceKey?: string; // 模块resource
  maxCount?: number;
  showRemoveIcon?: boolean; // 展示删除按钮
  fileListCallBack?: (fileList: any[]) => void;
  multiple?: boolean;
  fileListExtension?: any[]; // 回显fileList
  descExtensions?: string;
  disabled?: boolean;
  maxSize?: number;
  asyncHandle: (data: any) => Promise<any>;
  asyncParams: any;
  uploadCallback: (data: any) => void;
  deleteCallback?: (data: any) => void;
  showFileList?: boolean;
}

const CommonUploadButton: React.FC<CommonUploadButtonProps> = ({
  resourceKey,
  fileListCallBack,
  maxCount = 1,
  showRemoveIcon = true,
  multiple = false,
  fileListExtension,
  descExtensions,
  disabled,
  onChange,
  maxSize = 100 * 1024 * 1024,
  asyncHandle,
  asyncParams,
  uploadCallback,
  deleteCallback,
  showFileList = true,
  ...props
}) => {
  const [options, setOptions] = useState<any>();
  const [list, setList] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadList, setUploadList] = useState<any[]>([]);
  const [signData, setSignData] = useState<any>();

  const getSignatureRequest = useRequest(asyncHandle, {
    manual: true,
    throttleWait: 500,
    onSuccess: (data) => {
      if (data.code === 0) {
        // setSignData(data?.result);
      }
    },
  });

  const uploadRequest = useRequest(asyncHandle, {
    manual: true,
    onSuccess: (data) => {
      const fileItem = {
        ...fileList?.[0],
        status: 'done',
        pathUrl: data?.data?.path,
        localPath: data?.data?.url,
      };
      setFileList([fileItem]);
      uploadCallback && uploadCallback(data?.data);
    },
  });

  const deleteRequest = useRequest(SystemService.deleteFile, {
    manual: true,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const customRequest = (options: any) => {
    const _file = options?.file;
    uploadRequest.run(_file);
    // uploadRequest.run(asyncParams, _file);
  };

  const previewFile = (file: any) => {
    window.open(file?.pathUrl, '_blank');
  };

  const onRemove = async (file: any) => {
    // deleteRequest.run({
    //   path: file?.localPath
    // })
    const _fileList = fileList?.filter((item) => item?.uid !== file?.uid);
    setFileList(_fileList);
    deleteCallback &&
      deleteCallback({
        path: file?.pathUrl,
      });
  };

  const getChangeValue = (info: any) => {
    if (showFileList) {
      setFileList(info?.fileList);
    }
  };

  const renderLoading = () => {
    const loadingStatus = [
      getSignatureRequest.loading,
      uploadRequest.loading,
    ].includes(true);
    return loadingStatus;
  };

  return (
    <Spin spinning={renderLoading()}>
      <Upload
        customRequest={customRequest}
        fileList={fileList}
        onPreview={previewFile}
        onRemove={onRemove}
        multiple={multiple}
        maxCount={maxCount}
        onChange={getChangeValue}
        showUploadList={{
          showRemoveIcon: showRemoveIcon,
        }}
        {...props}
      >
        <div className="upload-container">
          <Button disabled={disabled} icon={<UploadOutlined />}>
            选择文件
          </Button>
        </div>
        {descExtensions ? (
          <div style={{ padding: '5px' }}>{descExtensions}</div>
        ) : undefined}
      </Upload>
    </Spin>
  );
};

export default CommonUploadButton;
