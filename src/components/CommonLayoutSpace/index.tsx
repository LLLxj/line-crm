import { Row, Space, SpaceProps } from 'antd'

const CommonLayoutSpace = ({
  children,
  className,
  ...props
}: SpaceProps) => {
  return (
    <Row
      className='common-space-layout'
    >
      <Space
        direction="vertical"
        className={`space ${className}`}
        {...props}
      >
        {children}
      </Space>
    </Row>
    
  );
};

export default CommonLayoutSpace