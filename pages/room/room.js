// pages/room/room.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAddFriendDialog: false,
    showPayDialog: false,
    roomInfo: {
      roomNo: "",
      teaScore: 0,
    },
    players: [],
    msgList: [],
    payForm: {
      to: undefined,
      amount: undefined,
    },
    wxCodeUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("room page laod start:", options);
    const roomNo = decodeURIComponent(options.roomNo);
    const wxCodeUrl = `http://localhost:8080/api/v1/room/getRoomWxCode?roomNo=${roomNo}`;
    this.setData({
      wxCodeUrl,
    });
    app.starx.on("onSyncRoomInfo", this.onSyncRoomInfo);
    app.starx.on("onMessage", this.onMessage);
    app.starx.on("onReJoinRoom", this.onReJoinRoom);
    app.starx.notify("room.ClientInitCompleted");
  },
  onShow() {
    if (wx.canIUse("hideHomeButton")) {
      wx.hideHomeButton();
    }
  },
  onUnload() {
    app.starx.off("onSyncRoomInfo", this.onSyncRoomInfo);
    app.starx.off("onMessage", this.onMessage);
    app.starx.off("onPlayerEnter", this.onPlayerEnter);
  },
  onReJoinRoom(roomNo) {
    app.starx.request("room.ReJoinRoom", { roomNo }, (res) => {
      app.starx.notify("room.ClientInitCompleted");
    });
  },
  onSyncRoomInfo(data) {
    console.log("onSyncRoomInfo: ", data);
    const { roomInfo, players } = data;
    this.setData({
      roomInfo,
      players,
    });
  },
  onMessage(m) {
    console.log(m);
    const msgList = this.data.msgList.concat(m);
    this.setData({
      msgList: msgList,
    });
  },
  onPlayerEnter() {
    console.log("player enter");
  },
  openAddFriendDialog(e) {
    this.setData({
      showAddFriendDialog: true,
    });
  },
  addPlayer(p) {
    const players = this.data.players.concat(p);
    this.setData({
      players: players,
    });
  },
  addMsg(m) {
    const msgList = this.data.msgList.concat(m);
    this.setData({
      msgList: msgList,
    });
  },
  exitRoom(e) {
    app.starx.request("room.ExitRoom", {}, (res) => {});
    wx.redirectTo({
      url: "../index/index",
    });
  },
  closeAddFriendDialog(e) {
    this.setData({
      showAddFriendDialog: false,
    });
  },
  openPayDialog(e) {
    this.setData({
      showPayDialog: true,
    });
  },
  closePayDialog(e) {
    this.setData({
      showPayDialog: false,
    });
  },
  toPayView(e) {
    wx.navigateTo({
      url: "../pay/pay",
    });
  },
  toSettlementView(e) {
    wx.navigateTo({
      url: "../settlement/settlement",
    });
  },
});
