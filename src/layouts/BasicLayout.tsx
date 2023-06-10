/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import type { Dispatch } from 'umi';
import { Link, useIntl, connect, history } from 'umi';
import { Result, Button } from 'antd';
import { authRouter } from '@/utils/authRouter';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import './BasicLayout.less';
import { Vertication } from '@/components';
import { ModalInitRef } from '@/pages/type';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  userInfo: any;
} & ProLayoutProps;
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};
/** Use Authorized check all menu item */
// const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
//   menuList.map((item) => {
//     const localItem = {
//       ...item,
//       children: item.children ? menuDataRender(item.children) : undefined,
//     };
//     return Authorized.check(item.authority, localItem, null) as MenuDataItem;
//   });

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    userInfo,
  } = props;
  const menuDataRef = useRef<MenuDataItem[]>([]);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'login/getUserInfo',
        payload: {},
      });
    }
  }, []);
  /** Init variables */

  const formatList = (menuList: MenuDataItem[]): MenuDataItem[] => {
    const _list = menuList.map((item) => {
      const localItem = {
        ...item,
        children: item.children ? formatList(item.children) : undefined,
      };
      return localItem;
    });
    return _list;
  };

  const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
    const _list = formatList(menuList);
    console.log('_list');
    console.log(_list);
    console.log(menuList);
    console.log(userInfo);
    let _formatList: any[] = _list;
    if (userInfo?.permNameSet?.length) {
      _formatList = authRouter(userInfo, _list);
    }
    console.log(_formatList);
    return _formatList;
  };

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  const {} = useIntl();
  return (
    <ProLayout
      logo={null}
      {...props}
      {...settings}
      // onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
    >
      <div className="content">{children}</div>
      {/* <Authorized
        authority={authorized!.authority}
        noMatch={noMatch}
      >
        
      </Authorized> */}
    </ProLayout>
  );
};

export default connect(({ global, settings, login }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  userInfo: login.userInfo,
}))(BasicLayout);
