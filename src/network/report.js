import { request } from "./request";

//查询用户信息
export function queryReportData() {
  return request({
    url: "reports/type/1",
    method: "get",
  });
}
