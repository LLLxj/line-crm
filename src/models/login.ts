import type { Reducer, Effect } from 'umi';
import { history } from 'umi';
import System from '@/services/system';
import { formatPermissionCodes } from '@/utils'


export type StateType = {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  userInfo?: any;
};

export type LoginModelType = {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect,
    getUserInfo: Effect,
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    saveUserInfo: Reducer<any>
  };
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    userInfo: {}
  },

  effects: {

    *login (data, { call, put }) {
      const { payload: { params } } = data
      const _response = yield System.login(params);
      let _mergeResponse = {
        ..._response?.data
      }
      localStorage.setItem('token', _response.data.token);
      localStorage.setItem('userId', _response.data.userId);

      // yield put({
      //   type: 'saveUserInfo',
      //   payload: _mergeResponse,
      // });
      history.replace('/dashboard');
    },

    *getUserInfo (data, { call, put }) {
      const userId = localStorage.getItem('userId')
      const _response = yield System.userInfo(userId);
      console.log(_response);
      let _mergeResponse = {
        ..._response?.data
      }
      yield put({
        type: 'saveUserInfo',
        payload: _mergeResponse,
      });
      history.replace('/dashboard');
    },

    *logout(_, { call }) {
      const response = yield call(System.logout);
      if (response?.code === 0) {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        history.replace('/login');
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveUserInfo(state, action) {
      console.log(action);
      return {
        ...state,
        userInfo: action.payload || {},
      };
    },
  },
};

export default Model;
