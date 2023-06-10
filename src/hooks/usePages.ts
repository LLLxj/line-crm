import { useState } from 'react';

const usePages = () => {
  const defaultPaegs = {
    current: 1,
    pageSize: 20,
    total: 0,
  };
  const [pages, setPages] = useState(defaultPaegs);
  return {
    pages,
    setPages,
    defaultPaegs,
  };
};

export default usePages;
