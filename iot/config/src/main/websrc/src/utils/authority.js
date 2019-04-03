// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return JSON.parse(localStorage.getItem('config_userInfo'));
}

export function setAuthority(authority) {
  return localStorage.setItem('config_userInfo', JSON.stringify(authority));
}
