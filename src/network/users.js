import { request } from "./request";
//获取用户信息
export function getUsersData(paramsObject) {
  return request({
    url: "users",
    method: "get",
    params: {
      query: paramsObject.query,
      pagenum: paramsObject.pagenum,
      pagesize: paramsObject.pagesize,
    },
  });
}

//修改用户状态
export function updatedUserState(paramsObject) {
  return request({
    url: `users/${paramsObject.uId}/state/${paramsObject.type}`,
    method: "put",
    // data: {
    //   uId: paramsObject.uId,
    //   type: paramsObject.type,
    // },
  });
}

//添加用户
export function addUser(paramsObject) {
  return request({
    url: "users",
    method: "post",
    data: {
      username: paramsObject.username,
      password: paramsObject.password,
      email: paramsObject.email,
      mobile: paramsObject.mobile,
    },
  });
}

//查询用户信息
export function queryUser(paramsObject) {
  return request({
    url: `users/${paramsObject.id}`,
    method: "get",
  });
}

//编辑用户提交
export function updateUser(paramsObject) {
  return request({
    url: `users/${paramsObject.id}`,
    method: "put",
    data: {
      id: paramsObject.id,
      email: paramsObject.email,
      mobile: paramsObject.mobile,
    },
  });
}

//删除用户
export function deleteUser(paramsObject) {
  return request({
    url: `users/${paramsObject.id}`,
    method: "delete",
  });
}
