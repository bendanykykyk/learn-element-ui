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
      type: paramsObject.type,
      pagenum: paramsObject.pagenum ? paramsObject.pagenum : "",
      pagesize: paramsObject.pagesize ? paramsObject.pagesize : "",
    },
  });
}

/**
 * @description: 1.6.2. 添加分类
 * @param {} paramsObject {cat_pid,cat_name,cat_level}
 * @return {*}
 */
export function addCategory(paramsObject) {
  return request({
    url: "categories",
    method: "post",
    data: {
      cat_pid: paramsObject.cat_pid,
      cat_name: paramsObject.cat_name,
      cat_level: paramsObject.cat_level,
    },
  });
}

/**
 * @description: 1.6.3. 根据 id 查询分类
 * @param {id:分类ID}
 * @return {*}
 */
export function queryCategoryById(id) {
  return request({
    url: `categories/${id}`,
    method: "get",
  });
}

/**
 * @description: 1.6.4. 编辑提交分类
 * @param {*}
 * @return {*}
 */
export function editCategoryById(paramsObject) {
  return request({
    url: `categories/${paramsObject.cat_id}`,
    method: "put",
    data: {
      cat_name: paramsObject.cat_name,
    },
  });
}

/**
 * @description: 1.6.5. 删除分类
 * @param {id:分类ID}
 * @return {*}
 */
export function deleteCategory(id) {
  return request({
    url: `categories/${id}`,
    method: "delete",
  });
}
