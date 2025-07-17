// pages/room/room.js
import config from "../../config/env";
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
      to: {
        uid: 0,
        nickname: "",
        avatar: "",
      },
      amount: "",
    },
    wxCodeUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("room page laod start:", options);
    const roomNo = decodeURIComponent(options.roomNo);
    const wxCodeUrl = `${config.apiBaseUrl}/v1/room/getRoomWxCode?roomNo=${roomNo}`;
    this.setData({
      "roomInfo.roomNo": roomNo,
      wxCodeUrl,
    });
    app.starx.on("onSyncRoomState", this.onSyncRoomState);
    app.starx.on("onSyncRoomRecords", this.onSyncRoomRecords);
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
    app.starx.off("onSyncRoomState", this.onSyncRoomState);
    app.starx.off("onSyncRoomRecords", this.onSyncRoomRecords);
    app.starx.off("onMessage", this.onMessage);
    app.starx.off("onReJoinRoom", this.onReJoinRoom);
  },
  onReJoinRoom(roomNo) {
    app.starx.request("room.ReJoinRoom", { roomNo }, (res) => {
      app.starx.notify("room.ClientInitCompleted");
    });
  },
  onSyncRoomState(data) {
    console.log("onSyncRoomState: ", data);
    const { roomInfo, players } = data;
    this.setData({
      roomInfo,
      players,
    });
  },
  onSyncRoomRecords(msgList) {
    console.log(msgList);
    this.setData({
      msgList: msgList,
    });
  },
  onMessage(m) {
    console.log(m);
    const msgList = this.data.msgList.concat(m);
    this.setData({
      msgList: msgList,
    });
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
  bindPayFormAmount(e) {
    this.setData({
      "payForm.amount": e.detail.value,
    });
  },
  openPayDialog(e) {
    console.log(e);
    const uid = e.currentTarget.dataset.uid;
    const player = this.data.players.find((p) => p.uid == uid);
    this.setData({
      showPayDialog: true,
      payForm: {
        to: player,
        amount: "",
      },
    });
  },
  closePayDialog(e) {
    this.setData({
      showPayDialog: false,
    });
  },
  handlePay() {
    console.log(this.data.payForm);
    app.starx.notify("room.PayToOne", { tid: this.data.payForm.to.uid, score: Number(this.data.payForm.amount) });
    this.closePayDialog();
  },
  closeAddFriendDialog(e) {
    this.setData({
      showAddFriendDialog: false,
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
