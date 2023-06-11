import React from 'react';
import './index.less';

interface PreviewPicProps {
  url: string;
}

const PreviewPic: React.FC<PreviewPicProps> = ({ url }) => {
  return (
    <div className="pic__container">
      <img src={url} alt="" />
    </div>
  );
};

export default PreviewPic;
