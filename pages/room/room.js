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
      teaOpt: {
        limit: 0,
        ratio: 0,
      },
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
    userInfo: {
      uid: 0,
    },
    showModal: "",
    setTeaOptForm: {
      limit: 0,
      ratio: 0,
    },
    payManyForm: {
      players: [],
      teaScore: "",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const roomNo = decodeURIComponent(options.roomNo);
    wx.setNavigationBarTitle({
      title: `打牌记账 ${roomNo} 房间`,
    });
    const wxCodeUrl = `${config.apiBaseUrl}/v1/room/getRoomWxCode?roomNo=${roomNo}`;
    this.setData({
      "roomInfo.roomNo": roomNo,
      wxCodeUrl,
      userInfo: app.globalData.userInfo,
    });
    app.starx.on("onSyncRoomState", this.onSyncRoomState.bind(this));
    app.starx.on("onSyncRoomRecords", this.onSyncRoomRecords.bind(this));
    app.starx.on("onMessage", this.onMessage.bind(this));
    app.starx.on("onReJoinRoom", this.onReJoinRoom.bind(this));
    app.starx.notify("room.ClientInitCompleted");
  },
  onShow() {
    if (wx.canIUse("hideHomeButton")) {
      wx.hideHomeButton();
    }
  },
  onUnload() {
    app.starx.off("onSyncRoomState");
    app.starx.off("onSyncRoomRecords");
    app.starx.off("onMessage");
    app.starx.off("onReJoinRoom");
  },
  onReJoinRoom(roomNo) {
    app.starx.request("room.ReJoinRoom", { roomNo }, (res) => {
      app.starx.notify("room.ClientInitCompleted");
    });
  },
  onSyncRoomState(data) {
    console.log("onSyncRoomState", data);
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
    this.scrollToBottom();
  },
  onMessage(m) {
    const msgList = this.data.msgList.concat(m);
    this.setData({
      msgList: msgList,
    });
    this.scrollToBottom();
  },
  openAddFriendDialog(e) {
    this.setData({
      showAddFriendDialog: true,
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
  hideModal() {
    this.setData({
      showModal: "",
    });
  },
  showSetTeaOptModal() {
    this.setData({
      showModal: "setTeaOpt",
      setTeaOptForm: this.data.roomInfo.teaOpt,
    });
  },
  bindSetTeaOptMaxScoreInput(e) {
    this.setData({
      "setTeaOptForm.limit": e.detail.value,
    });
  },
  decrease() {
    let that = this;
    let ratio = that.data.setTeaOptForm.ratio - 1;
    if (ratio < 0) {
      ratio = 0;
    }
    that.setData({
      "setTeaOptForm.ratio": ratio,
    });
  },
  increase() {
    let that = this;
    let ratio = that.data.setTeaOptForm.ratio + 1;
    that.setData({
      "setTeaOptForm.ratio": ratio,
    });
  },
  handleSetTeaOpt() {
    console.log(this.data.setTeaOptForm);
  },
  showPayManyModal() {
    const players = this.data.players
      .filter((p) => p.uid !== this.data.userInfo.uid)
      .map((p) => {
        return { ...p, score: "" };
      });
    console.log(players);
    this.setData({
      showModal: "payMany",
      payManyForm: {
        players: players,
        teaScore: "",
      },
    });
  },
  bindPayManyScoreInput(e) {
    const i = e.currentTarget.dataset.index;
    const key = "payManyForm.players[" + i + "].score";
    this.setData({
      [key]: e.detail.value,
    });
  },
  bindPayManyTeaScoreInput(e) {
    this.setData({
      "payManyForm.teaScore": e.detail.value,
    });
  },
  handlePayMany() {
    const many = this.data.payManyForm.players
      .filter((p) => p.score)
      .map((p) => ({ tid: p.uid, score: Number(p.score) }));
    const data = { many };
    if (this.data.payManyForm.teaScore) {
      data.tea = { score: Number(this.data.payManyForm.teaScore) };
    }
    console.log(data);
    app.starx.notify("room.PayToMany", data);
    this.hideModal();
  },
  showSettleModal() {
    this.setData({
      showModal: "settle",
    });
  },
  toSetting() {
    wx.navigateTo({
      url: "../setting/setting",
    });
  },
  toPayView(e) {
    if (this.data.players.length <= 1) {
      wx.showToast({
        title: "房间内只有一个人，没有可支出的对象",
        icon: "none",
      });
      return;
    }
    wx.navigateTo({
      url: "../pay/pay",
    });
  },
  toSettlementView(e) {
    wx.navigateTo({
      url: "../settlement/settlement",
    });
  },
  scrollToBottom() {
    const query = wx.createSelectorQuery();
    query
      .select(".cu-chat")
      .boundingClientRect((rect) => {
        if (rect) {
          this.setData({ scrollTop: rect.height });
        }
      })
      .exec();
  },
});
