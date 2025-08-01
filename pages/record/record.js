// pages/record/record.js
import { getRecords } from "../../api/room";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    currentPage: 1,
    pageSize: 10,
    hasMore: true,
    isLoading: false,
  },
  onLoad(options) {
    this.loadMoreData();
  },
  loadMoreData() {
    const { currentPage, pageSize, isLoading, hasMore } = this.data;
    // 防止重复加载和没有更多数据时继续加载
    if (isLoading || !hasMore) {
      return;
    }

    this.setData({
      isLoading: true,
    });

    getRecords({ page: currentPage, pageSize: pageSize }).then((res) => {
      const newItems = this.data.items.concat(res.data);
      this.setData({
        items: newItems,
        currentPage: currentPage + 1,
        hasMore: res.hasMore,
        isLoading: false,
      });
    });
  },
  onReachBottom() {
    console.log("to bottom");
    if (!this.data.hasMore || this.data.isLoading) {
      return;
    }
    this.loadMoreData();
  },
});
