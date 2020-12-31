import { request } from "./request";

/**
 * @description: 1.10.1. 订单数据列表
 * @param {*} paramsObject
 * @return {*}
 */
export function queryOrdersList(paramsObject) {
  return request({
    url: "orders",
    method: "get",
    params: {
      query: paramsObject.query,
      pagenum: paramsObject.pagenum,
      pagesize: paramsObject.pagesize,
      user_id: paramsObject.user_id ? paramsObject.user_id : "",
      pay_status: paramsObject.pay_status ? paramsObject.pay_status : "",
      is_send: paramsObject.is_send ? paramsObject.is_send : "",
      order_fapiao_title: paramsObject.order_fapiao_title
        ? paramsObject.order_fapiao_title
        : "",
      order_fapiao_company: paramsObject.order_fapiao_company
        ? paramsObject.order_fapiao_company
        : "",
      consignee_addr: paramsObject.consignee_addr
        ? paramsObject.consignee_addr
        : "",
    },
  });
}

/**
 * @description: 1.10.5. 查看物流信息
 * @param {*} paramsObject
 * @return {*}
 */
export function queryKuaiDi(id) {
  return request({
    url: "kuaidi/${id}",
    method: "get",
  });
}
