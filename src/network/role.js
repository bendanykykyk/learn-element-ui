import { request } from "./request";

//查询角色列表信息 1.5.1. 角色列表
export function queryRole() {
  return request({
    url: "roles",
    method: "get",
  });
}

//删除角色指定权限
export function deleteRoleById(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "delete",
  });
}

/**
 * @description: 获取所有权限列表
 * @method: get
 * @param {*} type （list 或 tree , list 列表显示权限）
 * @return {*}
 */
export function queryRightList(type) {
  return request({
    url: `rights/${type}`,
    method: "get",
  });
}

/**
 * @description: 角色授权
 * @param {*} roleId 当前角色的id
 * @param {*} rids 1，2，3级节点，半选中和全选中都要
 * @return {*}
 */
export function dispatchRoleRight(roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: "post",
    data: {
      roleId: roleId,
      rids: rids,
    },
  });
}
