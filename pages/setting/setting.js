// pages/setting/setting.js
import { updateAvatarNickname } from "../../api/user";

const defaultAvatarUrl = "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";
const app = getApp();

Page({
  data: {
    nickname: "",
    avatar: defaultAvatarUrl,
  },
  onLoad() {
    this.getUserInfo();
  },
  getUserInfo() {
    if (app.globalData.userInfo) {
      const { nickname, avatar } = app.globalData.userInfo;
      this.setData({
        nickname,
        avatar,
      });
    }
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatar: avatarUrl,
    });
  },
  onInputChange(e) {
    this.setData({
      nickname: e.detail.value,
    });
  },
  confirm() {
    updateAvatarNickname(this.data).then((res) => {
      console.log(res);
      const { nickname, avatar } = this.data;
      app.globalData.userInfo.nickname = nickname;
      app.globalData.userInfo.avatar = avatar;
      if (res.code === 200) {
        wx.navigateBack();
      }
    });
  },
  cancel() {
    wx.navigateBack();
  },
});
