import { request } from "./request";

//首页-获取菜单信息
export function getMenuData() {
  return request({
    url: "menus",
    method: "get",
  });
}
