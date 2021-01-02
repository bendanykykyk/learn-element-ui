module.exports = {
  configureWebpack: {
    entry:
      process.env.NODE_ENV === "production"
        ? "./src/main-prod.js"
        : "./src/main-devel.js",
    resolve: {
      alias: {
        //取别名，方便寻资源
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        network: "@/network",
        views: "@/views",
      },
    },
    //通过externals加载CDN资源
    externals: {
      echarts: "echarts",
      lodash: "lodash",
    },
  },
};
