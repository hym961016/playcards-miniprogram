// pages/history/history.js
import { getTotalInfo, getHistory } from "../../api/room";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalInfo: {
      totalScore: 0,
      totalWin: 0,
      totalLose: 0,
      totalTime: 0,
      winRate: 0,
    },
    userInfo: app.globalData.userInfo,
    slideButtons: [
      {
        text: "总分排行",
      },
      {
        text: "流水",
      },
      {
        type: "warn",
        text: "删除",
      },
    ],
    showRank: false,
    rankButtons: [{ text: "关闭" }, { text: "转发给好友" }],
    groupedRecords: [],
    rankData: [
      {
        id: 1,
        nickname: "微信用户8934",
        score: 1000,
      },
      {
        id: 2,
        nickname: "微信用户8934",
        score: 1000,
      },
      {
        id: 3,
        nickname: "微信用户8934",
        score: -200,
      },
      {
        id: 4,
        nickname: "微信用户8934",
        score: -300,
      },
    ],
  },
  onLoad(options) {
    getTotalInfo().then((res) => {
      this.setData({
        totalInfo: res,
      });
    });
    getHistory().then((res) => {
      this.groupByYear(res);
    });
  },
  groupByYear(rawRecords) {
    if (!rawRecords && rawRecords.length == 0) {
      return;
    }
    const groupMap = {};

    // 遍历原始数据，按年份归类
    rawRecords.forEach((record) => {
      const date = new Date(record.createdAt);
      const year = date.getFullYear(); // 提取年份（如2023-03-15 → 2023）
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
    console.log(groupedRecords);
    this.setData({ groupedRecords });
  },
  slideButtonTap(e) {
    console.log(e);
    const index = e.detail.index;
    switch (index) {
      case 0:
        console.log("总分排行");
        this.setData({
          showRank: true,
        });
        break;
      case 1:
        console.log("流水");
        wx.navigateTo({
          url: "../record/record",
        });
        break;
      case 2:
        console.log("删除");
        wx.showModal({
          title: "删除提醒",
          content: "点击确认删除后，此次房间数据将不再展示！",
          complete: (res) => {
            if (res.cancel) {
            }

            if (res.confirm) {
            }
          },
        });
        break;
    }
  },
  rankButtonTap(e) {
    console.log(e);
    const index = e.detail.index;
    if (index === 0) {
      this.setData({
        showRank: false,
      });
    } else if (index === 1) {
    }
  },
  closeRankDialog() {
    this.setData({
      showRank: false,
    });
  },
});
