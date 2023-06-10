import type React from 'react';
import { useMemo } from 'react';
import { connect } from 'dva';
import type { ConnectState } from '@/models/connect';

export interface AccessProps {
  userInfo: any; // 暂时未确定userInfo信息
  permission: string | string[];
  children: any;
  validateConditionStatus?: boolean;
}

const Access = ({
  userInfo,
  permission,
  children,
  validateConditionStatus = true,
}: AccessProps) => {
  const isValid = useMemo(() => {
    if (Array.isArray(permission)) {
      const _permissionStatus = permission.some((p) =>
        userInfo?.permNameSet?.includes(p),
      );
      return _permissionStatus && validateConditionStatus;
    }
    return (
      userInfo?.permNameSet?.includes(permission) && validateConditionStatus
    );
  }, [userInfo, permission, validateConditionStatus]);
  return isValid ? children : <></>;
};

export default connect(({ login }: ConnectState) => ({
  userInfo: login.userInfo,
}))(Access);
