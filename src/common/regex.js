/**
 * 用于element中表单校验
 */

//验证邮箱
export const checkEmail = (rule, value, cb) => {
  const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  regEmail.test(value) ? cb() : cb(new Error("请输入正确的邮箱"));
};

//验证手机号
export const checkPhone = (rule, value, cb) => {
  const regPhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

  regPhone.test(value) ? cb() : cb(new Error("请输入正确的手机号"));
};

//验证手机号
// export const checkPhone = (rule, value, cb) => {
//   const regPhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

//   regPhone.test(value) ? cb() : cb(new Error("请输入正确的手机号"));
// };
