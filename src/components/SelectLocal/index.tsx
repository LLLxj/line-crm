/**
 * 传入list
 * author lzj
 */

import { Select, Spin, Row } from 'antd';
import type { SelectProps } from 'antd';
import './index.less';

const { Option } = Select;

interface CommonSelectProps<T> extends SelectProps<T> {
  timeout?: number; // 延迟时间
  selectKey: string;
  selectLabel: string;
  list: any[];
  onChange?: (
    value: any,
    label: any | any[],
    format?: (value: any, options: any) => any,
  ) => void;
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  cacheKey?: string; // 缓存key
  refreshDeps?: any; // 刷新依赖
  disabled?: boolean;
  triggerNodeIsNotParent?: boolean;
}

type CustomSelect = <RecordType extends object = any>(
  props: CommonSelectProps<RecordType>,
) => JSX.Element;

const CommonSelect: CustomSelect = ({
  timeout,
  selectKey,
  selectLabel,
  placeholder,
  mode,
  onChange,
  cacheKey,
  refreshDeps,
  disabled,
  list,
  triggerNodeIsNotParent,
  ...props
}) => {
  const onSelectChange = (value, options) => {
    onChange && onChange(value, options);
  };

  return (
    <Row className="async-select-wrapper">
      <Select
        allowClear
        showSearch
        disabled={disabled}
        loading={list?.length === 0}
        notFoundContent={list?.length === 0 ? [] : null}
        onChange={onSelectChange}
        placeholder={placeholder}
        mode={mode}
        optionFilterProp="children"
        getPopupContainer={(triggerNode) => {
          return triggerNodeIsNotParent
            ? document.body
            : triggerNode.parentNode;
        }}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...props}
      >
        {list?.map((d) => (
          <Option
            key={d?.[selectKey] + d?.[selectLabel]}
            value={d?.[selectKey]}
            label={d?.[selectLabel]}
          >
            {d?.[selectLabel]}
          </Option>
        ))}
      </Select>
    </Row>
  );
};

export default CommonSelect;
