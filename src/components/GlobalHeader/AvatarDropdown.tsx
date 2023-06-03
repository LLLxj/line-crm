import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import type { ConnectProps } from 'umi';
import { history, connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  userInfo: any;
  menu?: boolean;
} & Partial<ConnectProps>;

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: { key: React.Key; keyPath: React.Key[]; item: React.ReactInstance }) => {
    const { key } = event;
    console.log(key)
    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    } else if (key === 'center') {
      history.push('/person-center')
    }

  };

  render(): React.ReactNode {
    const {
      userInfo: info,
      menu,
    } = this.props;
    console.log(info);
    const { user: userInfo } = info
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return userInfo && userInfo.userName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
        { !userInfo.avatar
            ? <img
                className={styles.nameOrAvatar}
                src={`https://avatars.dicebear.com/api/initials/${userInfo.userName.substring(userInfo.userName.length - 2)}.svg?radius=50&margin=14`}
                alt=""
              />
            : <Avatar
                size="small"
                className={styles.avatar}
                src={userInfo.avatar}
                alt="avatar"
                />
          }
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ login }: ConnectState) => ({
  userInfo: login.userInfo
}))(AvatarDropdown);
