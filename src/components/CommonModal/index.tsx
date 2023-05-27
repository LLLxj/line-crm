import React, { useState } from 'react'
import { Modal } from 'antd'
import type { ModalProps } from 'antd'

interface CommonModalProps extends ModalProps{
  visible: boolean;
  draggable?: boolean;
  maskClosable?: boolean;
  onCancel?: () => void;
  footer?: React.ReactNode;
  centered?: boolean;
  title?: string | React.ReactNode;
}

const CommonModal: React.FC<CommonModalProps> = ({
  visible,
  maskClosable = false,
  onCancel,
  footer,
  centered = true,
  ...props
}) => {

  return (
    <Modal
      open={visible}
      closable={true}
      onCancel={onCancel}
      maskClosable={maskClosable}
      getContainer={false} // 指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom
      centered={centered}
      footer={footer}
      { ...props }
    >
      { props?.children }
    </Modal>
  )
}

export default CommonModal;
