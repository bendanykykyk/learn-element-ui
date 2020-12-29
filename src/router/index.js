import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

//懒加载
const Login = () => import("views/login/Login");
const Main = () => import("views/main/Main");
const Users = () => import("views/userList/Users");
const Role = () => import("views/rightManager/role/Role");
const Right = () => import("views/rightManager/right/Right");
const GoodsCategory = () =>
  import("views/goodsManager/goodsCategory/GoodsCategory");
const GoodsParams = () => import("views/goodsManager/goodsParams/GoodsParams");
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
    redirect: "/users",
    children: [
      { path: "/users", name: Users, component: Users },
      { path: "/roles", name: Role, component: Role },
      { path: "/rights", name: Right, component: Right },
      { path: "/categories", name: GoodsCategory, component: GoodsCategory },
      { path: "/params", name: GoodsParams, component: GoodsParams },
    ],
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

// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject)
//     return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location).catch((err) => err);
// };

export default router;
