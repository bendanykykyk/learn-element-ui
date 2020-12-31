import axios from "axios";

// import { Loading, Message } from 'element-ui'

export function request(config) {
  const instance = new axios.create({
    baseURL: "https://www.liulongbin.top:8888/api/private/v1/",
    // baseURL: "http://timemeetyou.com:8889/api/private/v1",
    timeout: 5000,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      //*测试接口用
      console.log(`url:${config.url} method:${config.method}`);
      console.log("请求参数:", config.params || config.data);
      //拦截下请求，把token复制
      config.headers.Authorization = window.sessionStorage.getItem("token");
      //拦截后需要将拦截下来的请求数据返回发送
      return config;
    },
    (err) => {}
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (res) => {
      // 拦截后需要将拦截下来处理成的结果返回
      console.log("相应结果:", res.data);
      console.log("--------------------");
      return res.data;
    },
    (err) => {
      console.log(err);
    }
  );

  return instance(config);
}
