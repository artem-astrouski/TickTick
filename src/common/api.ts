import axios from 'axios';

import { KeyValueRepository } from 'src/repositories/key-value-repository';
import { TokensRepository } from 'src/repositories/tokens-repository';

import { LoginForm, SignUpForm, Todo, TokensPair, User } from './models';

/* ------------- Instance ------------- */
const BASE_URL = 'https://todos-api.public.tiko.energy/api/';

const axiosManager = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
  },
});

/* ------------- Api ------------- */
export const login = async (loginForm: LoginForm) => {
  const res = await axiosManager.post<TokensPair>('/login/', loginForm);
  return res.data;
};

export const signUp = async (signUpForm: SignUpForm) => {
  const res = await axiosManager.post<User>('/register/', signUpForm);
  return res.data;
};

export const getTodos = async () => {
  const res = await axiosManager.get<Todo[]>('/todos/');
  return res.data;
};

export const postTodo = async (data: Todo['description']) => {
  const res = await axiosManager.post<Todo>('/todos/', { description: data });
  return res.data;
};

export const getTodoById = async (id: string) => {
  const res = await axiosManager.get<Todo>(`/todos/${id}/`);
  return res.data;
};

export const putTodo = async (todo: Todo) => {
  const res = await axiosManager.put(`/todos/${todo.id}`, { description: todo.id, done: todo.done });
  return res.data;
};

export const deleteTodo = async (id: string) => {
  const res = await axiosManager.delete(`/todos/${id}`);
  return res.data;
};

export const refreshToken = async (refresh: TokensPair['refresh']) => {
  const res = await axiosManager.post<TokensPair>('/token/refresh/', {
    refresh,
  });
  return res.data.access;
};

export const verifyToken = async (token: TokensPair['access']) => {
  const res = await axiosManager.post('/token/refresh/', { token });
  return res.data;
};

/* ------------- Interceptors ------------- */
const updateToken = async () => {
  const refresh = TokensRepository.getRefreshToken();

  if (refresh) {
    const accessToken = await refreshToken(refresh);

    if (accessToken) {
      TokensRepository.addAccessToken(accessToken);
    }

    return accessToken;
  }
};

axiosManager.interceptors.request.use(
  async config => {
    const token = TokensRepository.getAccessToken();

    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = 'application/json';
    }

    return config;
  },
  error => {
    console.debug('Error', error);
    throw error;
  },
);

axiosManager.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await updateToken();
        if (newAccessToken) {
          TokensRepository.addAccessToken(newAccessToken);
        }
        originalRequest.headers.Authorization = newAccessToken ? `Bearer ${newAccessToken}` : undefined;
        return axios(originalRequest);
      } catch (e) {
        console.debug('Error during updating token', e);
        KeyValueRepository.clearAll();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
