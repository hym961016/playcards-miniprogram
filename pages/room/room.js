// pages/room/room.js
import { exitRoom } from "../../api/game";

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const roomNo = decodeURIComponent(options.roomNo);
    console.log(roomNo);
    app.starx.on("onSyncRoomInfo", this.onSyncRoomInfo);
    app.starx.on("onMessage", this.onMessage);
    app.starx.on("onPlayerEnter", this.onPlayerEnter);
    app.starx.notify("room.ClientInitCompleted", { roomNo });
  },
  onUnload() {
    console.log("index unload...");
  },
  onShow() {
    console.log("on room page show...");
  },
  onHide() {
    console.log("on room page hide...");
  },
  onSyncRoomInfo(data) {
    console.log("onSyncRoomInfo: ", data);
    const { roomInfo, players } = data;
    this.setData({
      roomInfo,
      players,
    });
  },
  onMessage(data) {
    console.log(data);
    this.msgList.push(data);
    this.setData({
      msgList: this.msgList,
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
    exitRoom().then((res) => {
      if (res.statusCode === 0) {
        wx.redirectTo({
          url: "../index/index",
        });
      }
    });
  },
  closeAddFriendDialog(e) {
    this.setData({
      showAddFriendDialog: false,
    });
    const p = {
      avatarUrl: "",
      nickName: "微信用户679",
      amount: 30,
      isOwner: false,
    };
    const players = this.data.players.concat(p);
    this.setData({
      players: players,
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
