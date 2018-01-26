//index.js
//获取应用实例
import API from '../../../utils/api.js';
const util = require('../../../utils/util.js')
const app = getApp()
Page({
  data: {
    userInfo: {},
    forTime: {modate: '', weday: ''},
    isShowPop: {bol: false, type: 'source', title: '', text: ''},
    animationData: {},
    imgUrls: [],
    plant: {},
    plantTab: {},
    swiper: {
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      circular: true
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (e) {
    var that = this
    if(!wx.getStorageSync('userInfo')) {
        this.setData({
          "userInfo.avatarUrl": '/image/default_head.png'
        })
        this.getPlantData(e.id)
    } else {
      this.setData({
          userInfo: wx.getStorageSync('userInfo')
      })
      this.getPlantData(e.id)
    }
  },
  loginAuthorize: function() {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo
        })
        wx.setStorageSync('userInfo', res.userInfo)
        wx.hideLoading()

      }
    })
  },
  /*
   * 获取盆栽数据
   */
  getPlantData: function(id) {
    var that = this
    // 获取盆栽数据
    app.requestData(API.homeIndex, {id: id}, (err, data) =>{
      if (data != undefined) {
        var plant = JSON.stringify(data.plant)
        that.setData({
          plantS: plant,
          plant: data.plant,
          plantTab: data.plantTab
        })
        var imgUrls = data.plant.img.split(',')
        that.setData({
          imgUrls: imgUrls,
          "forTime.modate": util.formatDate(2) + '月' + util.formatDate(3) + '日',
          "forTime.weday": util.formatDate(4)
        })
      } 
    },'GET','home')
  },
  // 查看更多介绍
  lookSourceFn (e) {
    this.setData({
      "isShowPop.bol": true,
      "isShowPop.title": e.currentTarget.dataset.name + '介绍',
      "isShowPop.type": 'source',
      'isShowPop.text': e.currentTarget.dataset.info
    })
    this.animationFn(1)
  },
  // 关闭弹窗
  closeFn () {
    this.setData({
      "isShowPop.bol": false
    })
    this.animationFn(0)
  },
  animationFn: function(op){
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.opacity(op).step()
    this.setData({
      animationData:animation.export()
    })    
  },
  /* 
   * 图片放大
   */
  changeBig: function(e) {
    var bigImg = app.globalData.https + e.currentTarget.dataset.img
    wx.previewImage({  
      urls: bigImg.split(',')
    })
  }
})
