import request from '../utils/request';

// export async function accountLogin(params) {
//   return request(`/user/checkpwd?checkCode=${params.checkCode}`, {
//     method: 'POST',
//     body: params,
//   });
// }

export async function accountLogin(params) {
  return request(`/userservice/api/login`, {
    method: 'POST',
    body: params,
  });
}
