import { useWindowSize } from 'react-use';

const useContainerSize = () => {
  const { height, width } = useWindowSize();
  return {
    width,
    height,
  };
};

export default useContainerSize;
