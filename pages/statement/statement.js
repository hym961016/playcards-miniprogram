// 页面的js文件
Page({
  data: {
    // 原始数据（示例）：包含时间字段
    rawRecords: [
      { id: 1, time: "2023-03-15", content: "记录1" },
      { id: 2, time: "2022-11-20", content: "记录2" },
      { id: 3, time: "2023-08-05", content: "记录3" },
      { id: 4, time: "2021-05-10", content: "记录4" },
      { id: 5, time: "2022-01-25", content: "记录5" },
      { id: 6, time: "2022-01-25", content: "记录5" },
      { id: 7, time: "2020-01-25", content: "记录5" },
      { id: 8, time: "2022-01-25", content: "记录5" },
      { id: 9, time: "2022-01-25", content: "记录5" },
      { id: 10, time: "2022-01-25", content: "记录5" },
      { id: 11, time: "2022-01-25", content: "记录5" },
      { id: 12, time: "2022-01-25", content: "记录5" },
      { id: 13, time: "2022-01-25", content: "记录5" },
      { id: 14, time: "2022-01-25", content: "记录5" },
    ],
    groupedRecords: [], // 分组后的数据：[{year: '2023', items: [...]}, ...]
    yearTops: [], // 各年份标题的顶部位置（用于计算吸顶）
    currentStickyYear: "", // 当前吸顶的年份
  },

  onLoad() {
    // 1. 原始数据按年份分组
    this.groupByYear();
    // 2. 渲染后获取各年份标题的位置（需在DOM渲染完成后执行）
    this.getYearTitlePositions();
  },

  // 按年份分组
  groupByYear() {
    const { rawRecords } = this.data;
    const groupMap = {};

    // 遍历原始数据，按年份归类
    rawRecords.forEach((record) => {
      const year = record.time.split("-")[0]; // 提取年份（如2023-03-15 → 2023）
      if (!groupMap[year]) {
        groupMap[year] = [];
      }
      groupMap[year].push(record);
    });

    // 转换为数组并按年份倒序排列（最新年份在前）
    const groupedRecords = Object.keys(groupMap)
      .sort((a, b) => b - a) // 降序排列
      .map((year) => ({
        year,
        items: groupMap[year],
      }));

    this.setData({ groupedRecords });
  },

  // 获取各年份标题的位置（距离滚动容器顶部的距离）
  getYearTitlePositions() {
    const query = wx.createSelectorQuery().in(this);
    // 选择所有年份标题元素（class为year-title）
    query.selectAll(".year-title").boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        // 存储每个年份标题的top值（相对于滚动容器）
        const yearTops = res[0].map((rect, index) => ({
          year: this.data.groupedRecords[index].year,
          top: rect.top,
        }));
        this.setData({ yearTops });
      }
    });
  },

  // 监听滚动事件（控制吸顶）
  onScroll(e) {
    // console.log(e);
    const { scrollTop } = e.detail; // 当前滚动距离顶部的距离
    const { yearTops, groupedRecords } = this.data;

    if (yearTops.length === 0) return;

    // 找到当前应该吸顶的年份
    let currentStickyYear = "";
    for (let i = 0; i < yearTops.length; i++) {
      const current = yearTops[i];
      const next = yearTops[i + 1] || { top: Infinity };

      // 当滚动距离 >= 当前年份标题top，且 < 下一年份标题top时，当前年份吸顶
      if (scrollTop >= current.top && scrollTop < next.top) {
        currentStickyYear = current.year;
        break;
      }
    }

    console.log(currentStickyYear);
    this.setData({ currentStickyYear });
  },
});
