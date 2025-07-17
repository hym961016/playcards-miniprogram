// pages/pay/pay.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    players: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const pages = getCurrentPages();
    console.log(pages);
    const uid = app.getUid();
    const players = pages[0].data.players.filter((p) => p.uid !== uid);
    this.data.players = players.map((p) => {
      return { ...p, score: "" };
    });
    this.setData({
      players: this.data.players,
    });
  },
  bindPayScoreInput(e) {
    console.log(e);
    const i = e.currentTarget.dataset.index;
    const key = "players[" + i + "].score";
    this.setData({
      [key]: e.detail.value,
    });
  },
});
