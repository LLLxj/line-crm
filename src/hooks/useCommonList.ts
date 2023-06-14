type ResourceType = '状态' | '锁定' | '实名认证';

const useCommonList = (resource: ResourceType) => {
  const commonMap = {
    状态: {
      options: [
        { label: '禁用', value: 0 },
        { label: '正常', value: 1 },
      ],
      map: {
        0: '禁用',
        1: '正常',
      },
    },
    锁定: {
      options: [
        { label: '是', value: 0 },
        { label: '否', value: 1 },
      ],
      map: {
        0: '是',
        1: '否',
      },
    },
    实名认证: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      map: {
        1: '是',
        0: '否',
      },
    },
  };
  return {
    optionMap: commonMap?.[resource],
  };
};

export default useCommonList;
