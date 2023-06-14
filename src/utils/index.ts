/* eslint-disable radix */
import {
  isArray,
  isString,
  findIndex,
  debounce,
  isEqual,
  uniqWith,
  uniqBy,
  unionBy,
  sortBy,
  uniq,
} from 'lodash';
import { message } from 'antd';

type downloadParams = {
  handle: (params: any) => Promise<any>;
  params?: any;
};

const formatPermissionCodes = (userInfo: {
  permissions: Record<string, any>;
}) => {
  let functionCode = [] as any[];
  let routeCode = [] as any[];
  let authorityCodes = [] as any[];
  if (userInfo.permissions) {
    Object.keys(userInfo?.permissions).forEach((item) => {
      functionCode = [...functionCode, item];
      const _flatRoutes = flatPermissionCodes(
        item,
        userInfo?.permissions[item],
      );
      routeCode = [...routeCode, ..._flatRoutes];
      authorityCodes = [...functionCode, ...routeCode];
    });
  }

  return {
    ...userInfo,
    permissionList: authorityCodes,
  };
};

const flatPermissionCodes = (
  systemCode: string,
  permissionMap: Record<string, any>,
) => {
  const _permissionMap = permissionMap?.permissionCodes;
  let functionCode = [] as any[];
  let routeCode = [] as any[];
  let authorityCodes = [] as any[];
  if (_permissionMap) {
    Object.keys(_permissionMap).forEach((item) => {
      functionCode = [...functionCode, `${systemCode}${item}`];
      routeCode = [
        ...routeCode,
        ..._permissionMap[item]?.map((p: string) => `${systemCode}${item}${p}`),
      ];
    });
    authorityCodes = [...functionCode, ...routeCode];
  }
  return authorityCodes;
};
const filterObjKeyIsNull = (item) => {
  let _item = {};
  Object.keys(item).forEach((p) => {
    _item = {
      ..._item,
      [p]: item[p]
        ? isArray(item[p]) && !item[p]?.length
          ? undefined
          : item[p]
        : undefined,
    };
  });
  return _item;
};

const removeBlank = (value) => {
  return value.replace(/^\s+|\s+$/g, '');
};

const countTableCellWidth = ({ title, titleCol = 0 }) => {
  const baseWidth = 12;
  const _titleLength = titleCol || title?.length;
  const width = _titleLength * baseWidth + 32;
  return width;
};

const uploadBlob = (data: any, fileName: string) => {
  const blob = data;
  let link = document.createElement('a');
  link.href = URL.createObjectURL(
    new Blob(
      [blob],
      // { type: 'application/vnd.ms-excel' }
      // {
      //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // },
    ),
  );
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
};

const download = async ({ handle, params }: downloadParams) => {
  try {
    const response = await handle(params);
    console.log(response);
    let blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });

    let filename = (response.headers['content-disposition'] || '').split(
      'filename=',
    )[1];

    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = decodeURIComponent(filename);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    message.error('网络异常,请稍候');
    return Promise.reject(e);
  }
};

export {
  formatPermissionCodes,
  isArray as _isArray,
  isString as _isString,
  filterObjKeyIsNull,
  findIndex as _findIndex,
  debounce as _debounce,
  removeBlank,
  isEqual as _isEqual,
  uniqWith as _uniqWith,
  uniqBy as _uniqBy,
  unionBy as _unionBy,
  sortBy as _sortBy,
  uniq as _uniq,
  countTableCellWidth,
  uploadBlob,
  download,
};
