import React, { useEffect, useState } from 'react';
import { Select, Spin, Row } from 'antd';
import { useRequest } from 'ahooks';
import { useThrottle, useDebounce } from 'react-use';
import './index.less';
import { _unionBy } from '@/utils';

const { Option } = Select;
interface CommonSelectProps {
  timeout?: number; // 延迟时间
  value?: any;
  disabled?: boolean;
  selectKey: string;
  selectLabel: string;
  asyncHandle: (data: any) => Promise<any>; // api
  asyncParams?: any;
  onChange?: (
    value: any,
    label: string | string[],
    format?: (value: any, options: any) => any,
  ) => void;
  asyncKeyword: string; // keyword查询参数
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  cacheKey?: string; // 缓存key
  refreshDeps?: any; // 刷新依赖
  requestStart?: boolean;
  valueExtension?: any;
  listExtensions?: any[];
}

const CommonSelect: React.FC<CommonSelectProps> = ({
  timeout = 1000,
  selectKey,
  selectLabel,
  asyncHandle,
  asyncParams,
  asyncKeyword,
  placeholder,
  mode,
  onChange,
  cacheKey,
  refreshDeps,
  disabled,
  requestStart,
  valueExtension,
  listExtensions = [],
  ...props
}) => {
  const [value, setValue] = useState<string>('');
  const [list, setList] = useState<any[]>([]);
  const keyword = useThrottle(value, timeout);

  const listRequesRequest = useRequest(asyncHandle, {
    throttleWait: timeout,
    manual: true,
    onSuccess: (data) => {
      let _list = data?.data?.length
        ? data?.data?.map((item: { [x: string]: any }) => {
            return {
              key: item?.[selectKey],
              label: item?.[selectLabel],
              value: item?.[selectKey],
            };
          })
        : [];
      const _listExtensions = listExtensions?.map((item) => {
        return {
          key: item?.value,
          [selectKey]: item?.value,
          [selectLabel]: item?.label,
        };
      });
      _list = [..._list, ..._listExtensions];
      const _unionList = _unionBy(_list, selectKey);
      setList(_unionList);
    },
  });

  useEffect(() => {
    if (listExtensions?.length) {
      const _options = listExtensions?.map((item) => {
        return {
          ...item,
          label: item?.label,
          value: item?.value,
        };
      });
      setList(_options);
    }
  }, [listExtensions]);

  const [,] = useDebounce(
    async () => {
      if (keyword) {
        getList(keyword);
      }
    },
    600,
    [keyword],
  );

  const getList = (_value: string) => {
    listRequesRequest.run(_value);
  };

  const onSelectChange = (value, options) => {
    onChange && onChange(value, options);
  };

  const onSearchValue = (value: string) => {
    setValue(value);
  };

  return (
    <Row className="async-select-wrapper">
      <Select
        allowClear
        showSearch
        disabled={disabled}
        filterOption={false}
        loading={listRequesRequest.loading}
        notFoundContent={
          listRequesRequest.loading ? <Spin size="small" /> : null
        }
        onChange={onSelectChange}
        onSearch={onSearchValue}
        placeholder={placeholder}
        mode={mode}
        getPopupContainer={(triggerNode) => {
          return triggerNode.parentNode;
        }}
        options={list}
        {...props}
      />
    </Row>
  );
};

export default CommonSelect;
