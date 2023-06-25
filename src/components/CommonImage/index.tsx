import React from 'react';
import type { ImageProps } from 'antd';
import { Image, Button } from 'antd';
import { useToggle } from 'react-use';

interface CommonImageProps extends ImageProps {
  src: string;
}

const CommonImage: React.FC<CommonImageProps> = ({ src, ...props }) => {
  const [visible, setVisible] = useToggle(false);

  return (
    <div>
      {src ? (
        <Button type="link" onClick={setVisible}>
          预览
        </Button>
      ) : (
        <span>--</span>
      )}
      <Image
        width={200}
        style={{ display: 'none' }}
        src={src}
        preview={{
          visible,
          src: src,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
        {...props}
      />
    </div>
  );
};

export default CommonImage;
