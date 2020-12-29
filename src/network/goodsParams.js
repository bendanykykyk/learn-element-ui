import { request } from "./request";
/**
 * @description: 1.6.1商品分类数据列表查询
 * @param {*} paramsObject {type,pagenum,pagesize}
 * @return {*}
 */
export function queryGoodsCategories(paramsObject) {
  return request({
    url: "categories",
    method: "get",
    params: {
      type: paramsObject.type ? paramsObject.pagenum : "",
      pagenum: paramsObject.pagenum ? paramsObject.pagenum : "",
      pagesize: paramsObject.pagesize ? paramsObject.pagesize : "",
    },
  });
}

/**
 * @description: 1.7.1. 参数列表
 * @param {*} paramsObject {:id , sel}
 * @return {*}
 */
export function queryGoodsParams(paramsObject) {
  return request({
    url: `categories/${paramsObject.id}/attributes`,
    method: "get",
    params: {
      sel: paramsObject.sel,
    },
  });
}

/**
 * @description: 1.7.2. 添加动态参数或者静态属性
 * @param {*} paramsObject {:id , sel}
 * @return {*}
 */
export function addParams(paramsObject) {
  return request({
    url: `categories/${paramsObject.attr_id}/attributes`,
    method: "post",
    data: {
      attr_name: paramsObject.attr_name,
      attr_sel: paramsObject.attr_sel,
    },
  });
}

/**
 * @description: 1.7.3. 删除参数
 * @param {*} paramsObject {:id , sel}
 * @return {*}
 */
export function deleteParams(id, attrid) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "delete",
  });
}

/**
 * @description: 1.7.4. 根据 ID 查询参数
 * @param {*} paramsObject
 * @return {*}
 */
export function queryParamsById(paramsObject) {
  return request({
    url: `categories/${paramsObject.cat_id}/attributes/${paramsObject.attr_id}`,
    method: "get",
    data: {
      attr_sel: paramsObject.attr_sel,
    },
  });
}

/**
 * @description: 1.7.5. 编辑提交参数
 * @param {*} paramsObject 若填写attr_vals就是修改参数下的属性，不填attr_vals就是修改参数名字
 * @return {*}
 */
//data:{   ...paramsObject,...otherParamsObject} 靠这个也可以实现，
//但是为了数据能够往接口方面贴近，所以确定下来的还是照常写
export function editParam(paramsObject, otherParamsObject = null) {
  return request({
    url: `categories/${paramsObject.cat_id}/attributes/${paramsObject.attr_id}`,
    method: "put",
    data: {
      attr_name: paramsObject.attr_name,
      attr_sel: paramsObject.attr_sel,
      attr_vals: paramsObject.attr_vals ? paramsObject.attr_vals : "",
    },
  });
}
