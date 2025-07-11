// pages/settlement/settlement.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        title: "未结",
      },
      {
        title: "已结",
      },
    ],
    tabCur: 0,
    showSettleDialog: false
  },
  onLoad(options) {},
  tabSelect(e) {
    console.log(e);
    this.setData({
      tabCur: e.target.dataset.id,
    });
  },
  openSettleDialog(e) {
    this.setData({
      showSettleDialog: true
    })
  },
  closeSettleDialog(e) {
    this.setData({
      showSettleDialog: false
    })
  },
  toStatementView(e) {
    wx.navigateTo({
      url: '../statement/statement',
    })
  },
  toRankView(e) {
    wx.navigateTo({
      url: '../rank/rank',
    })
  }
});
