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
 * @description: 添加商品
 * @param {*} paramsObject
 * @return {*}
 */
export function addGoods(paramsObject) {
  return request({
    url: `goods`,
    method: "post",
    data: {
      goods_name: paramsObject.goods_name,
      goods_cat: paramsObject.goods_cat,
      goods_price: paramsObject.goods_price,
      goods_number: paramsObject.goods_number,
      goods_weight: paramsObject.goods_weight,
      goods_introduce: paramsObject.goods_introduce,
      pics: paramsObject.pics,
      attrs: paramsObject.attrs,
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
