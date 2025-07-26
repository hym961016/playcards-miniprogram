// pages/history/history.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
  },
  onLoad(options) {},
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
  rankButtonTap(e) {},
});
