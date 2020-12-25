import { request } from "./request";
//首页-获取多个信息
export function getLoginData(form) {
  return request({
    url: "login",
    params: {
      username: form.username,
      password: form.password,
    },
  });
}
