import { request } from "./request";

//查询用户信息
export function queryRightData(type) {
  return request({
    url: `rights/${type}`,
    method: "get",
  });
}
