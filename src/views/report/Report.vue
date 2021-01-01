<template>
  <div>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
//导入网络请求
import { queryReportData } from "network/report";
//导入安装好的echarts
const echarts = require("echarts");
//导入lodash
import _ from "lodash";

export default {
  name: "Report",
  data() {
    return {
      dataList: {},
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },

  mounted() {
    this.queryReportData();
  },

  methods: {
    queryReportData() {
      queryReportData().then((res) => {
        res.meta.status === 200
          ? (() => {
              this.dataList = _.merge(res.data, this.options);
              // 使用刚指定的配置项和数据显示图表。
              let myChart = echarts.init(document.getElementById("main"));
              myChart.setOption(this.dataList);
            })()
          : this.$message.error(res.meta.msg);
      });
    },
  },
};
</script>

<style scoped></style>
