//index.js
//获取应用实例
import API from '../../../utils/api.js';
const app = getApp()
Page({
  data: {
    userInfo: {},
    imgUrls: [],
    plantUrls: {},
    swiper: {
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      circular: true
    },
    operate: {},
    typeArr: {'water': '浇水记录', 'fertilize': '施肥记录', 'other': '其他操作记录'},
    operateType: '',
    plant: {},
    tapImg: ''
  },
  //事件处理函数
  bindViewTap: function() {
  },
  onLoad: function (e) {
    var plant = JSON.parse(e.plant)
    var type = e.type
    var plantImg = plant.img
    var plantId = plant.id
    wx.setNavigationBarTitle({title: this.data.typeArr[type]})
    if (!wx.getStorageSync('userInfo')) {
      this.setData({
        "userInfo.avatarUrl": '/image/default_head.png'
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
    this.setData({
        plantUrls: plantImg.split(','),
        operateType: this.data.typeArr[type],
        plantS: JSON.stringify(plant),
        tapImg: '/image/' + type + '.jpg'
    })
    this.getOperateInfo(plantId, type)
  },
  getOperateInfo: function(plantId, type) {
    // 获取操作数据
    var that = this
    if (type == 'water') {
      var t = 0
    } else if (type == 'fertilize') {
      var t = 1
    } else {
      var t = 2
    }
    app.requestData(API.homeOperate, {id: plantId, type: t}, (err, data) =>{
      var imgArr = []
      if (data != undefined) {
        that.setData({
          operate: data
        })
        for(var i in this.data.operate) {
          if (this.data.operate[i].img) {
            imgArr[i] = this.data.operate[i].img.split(',')
          }
        }
        that.setData({
          imgUrls: imgArr
        })
      } 
    },'GET','home')
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
