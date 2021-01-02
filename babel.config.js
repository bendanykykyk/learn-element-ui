const prodPlugins = [];
//生产时需要的插件
if (process.env.NODE_ENV === "production") {
  //去除console
  prod.push("transform-remove-console");
}
//开发环境时时需要的插件
if (process.env.NODE_ENV === "development") {
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
      //发布产品时的插件数组
      ...prodPlugins,
    ],
  ],
};
