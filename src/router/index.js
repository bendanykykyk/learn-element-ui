import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

//懒加载
const Login = () => import("views/login/Login");
const Main = () => import("views/main/Main");
const routes = [
  {
    path: "/",
    redirect: "login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

//添加路由导航守卫，在路由发生改变时，看看是否token有值，有值就放行，无值返回/login
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const isTokenExist = window.sessionStorage.getItem("token")
    ? next()
    : next("/login");
});

export default router;
