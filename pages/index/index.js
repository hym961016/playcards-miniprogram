// index.js
import { getUserInfo } from "../../api/user";
import { createRoom, isInRoom } from "../../api/game";

const app = getApp();

Page({
  data: {
    userInfo: {
      id: undefined,
      nickname: "",
      avatar: "",
    },
  },
  onLoad() {
    getUserInfo().then((res) => {
      this.setData({
        userInfo: res,
      });
    });
  },
  onShow() {
    // if (app.globalData.isCreateRoom) {
    //   console.log("create room");
    //   this.createRoomAction();
    //   app.globalData.isCreateRoom = false;
    // }
    // isInRoom().then((res) => {
    //   console.log(res);
    //   if (res.statusCode === 0) {
    //     if (res.isInRoom) {
    //       wx.redirectTo({
    //         url: "../room/room?roomNo=" + res.roomNo,
    //       });
    //     }
    //   }
    // });
  },
  getUserInfo() {},
  getRoom(e) {
    wx.navigateTo({
      url: "../setting/setting?from=getRoom",
    });
  },
  createRoomAction() {
    wx.showLoading({
      title: "加载中",
    });
    createRoom().then((res) => {
      console.log(res);
      wx.hideLoading();
      if (res.statusCode === 0) {
        wx.redirectTo({
          url: "../room/room?roomNo=" + res.roomNo,
        });
      }
    });
  },
  toUpdateUserInfoView(e) {
    wx.navigateTo({
      url: "../setting/setting",
    });
  },
});
