// pages/room/room.js
import { exitRoom } from "../../api/game";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAddFriendDialog: false,
    showPayDialog: false,
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

    const token = wx.getStorageSync("token");

    const ws = wx.connectSocket({
      url: `ws://localhost:8080/api/v1/game/joinRoom?roomNo=${roomNo}`,
      header: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      success: (res) => {
        console.log(res);
      },
      fail: (err) => {
        console.log(err);
      },
    });

    ws.onOpen((res) => {
      console.log(res);
    });

    ws.onClose((res) => {
      console.log(res, "scoket_one关闭");
    });

    ws.onMessage((res) => {
      console.log(res);
      const msg = JSON.parse(res.data);
      this.addMsg(msg);
      if (msg.type === 1) {
        this.addPlayer(msg.data);
      } else if (msg.type === 4) {
        this.syncState(msg.data);
      }
    });
  },
  openAddFriendDialog(e) {
    this.setData({
      showAddFriendDialog: true,
    });
  },
  syncState(data) {
    this.setData({
      players: data.users,
      msgList: data.msgList,
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
