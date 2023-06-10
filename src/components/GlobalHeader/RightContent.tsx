import { Tag } from 'antd';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import React, { useEffect, useRef } from 'react';
import type { ConnectProps } from 'umi';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import { Vertication } from '@/components';
import { ModalInitRef } from '@/pages/type';
import { useToggle } from 'react-use';

export type GlobalHeaderRightProps = {
  theme?: ProSettings['navTheme'] | 'realDark';
  userInfo: any;
} & Partial<ConnectProps> &
  Partial<ProSettings>;

const ENVTagColor = {
  local: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, userInfo } = props;
  let className = styles.right;

  const verticationRef = useRef<ModalInitRef>();
  const [visible, setVisible] = useToggle(false);

  useEffect(() => {
    if (userInfo?.user?.verify === 0 && userInfo?.user?.isClient === 1) {
      // verticationRef.current.init({})
      // renderVertify()
      if (!visible) {
        setVisible();
      }
    }
  }, [userInfo]);

  const renderVertify = () => {
    verticationRef?.current?.init({});
  };

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <Avatar />
      <Vertication
        visible={visible}
        setVisible={setVisible}
        // ref={verticationRef}
      />
      {/* <span>
        <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
      </span> */}
      {/* {
        REACT_APP_ENV && REACT_APP_ENV !== 'prod'
          ? <span>
              <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
            </span>
          : undefined
      } */}
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
};

export default connect(({ settings, login }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  userInfo: login.userInfo,
}))(GlobalHeaderRight);
