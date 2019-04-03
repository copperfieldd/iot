import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function accountLogin(params) {
  return request('/user/checkpwd', {
    method: 'POST',
    body: params,
  });
}

export async function accountLogout(params) {
  return request('/api/logout', {
    method: 'POST',
    body: params,
  });
}

