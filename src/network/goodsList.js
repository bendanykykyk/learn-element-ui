import { request } from "./request";

/**
 * @description: 1.8.1. 商品列表数据
 * @param {*} paramsObject
 * @return {*}
 */
export function queryGoodsData(paramsObject) {
  return request({
    url: `goods`,
    method: "get",
    params: {
      query: paramsObject.query,
      pagenum: paramsObject.pagenum,
      pagesize: paramsObject.pagesize,
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
 * @description: 1.8.5. 删除商品
 * @param {*} id
 * @return {*}
 */
export function deleteGoods(id) {
  return request({
    url: `goods/${id}`,
    method: "delete",
  });
}
