
import React from 'react';
import { Spin } from 'antd';
import './index.less'

const PageLoading: React.FC = () => {

  return (
    <div className='page-loading-container'>
      <Spin
        spinning={true}
      />
    </div>
  )
}

export default PageLoading;
