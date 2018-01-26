//index.js
//获取应用实例
import API from '../../../utils/api.js';
const util = require('../../../utils/util.js')
const app = getApp()
Page({
  data: {
    userInfo: {},
    forTime: {modate: '', weday: ''},
    imgUrls: [],
    plant: {},
    plantS: '',
    swiper: {
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      circular: true
    },
    isPop: false,
    list: {real_name: '姓名:', sex: '性别:', age: '年龄:', phone: '电话:', email: '邮箱:', address: '地址:'},
    listArr: [],
    listData: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (e) {
    var plant = JSON.parse(e.plant)
    var imgUrls = plant.img.split(',')
    wx.setNavigationBarTitle({title: '盆栽管理员'})
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
      plantUrls: plant.img.split(','),
      plantS: JSON.stringify(plant),
      plant: plant,
      imgUrls: imgUrls,
      "forTime.modate": util.formatDate(2) + '月' + util.formatDate(3) + '日',
      "forTime.weday": util.formatDate(4)
    })
    this.getMange(plant.id)
  },
  /*
   * 获取关联员列表
   */
  getMange: function(id) {
    var that = this
    app.requestData(API.homeMange, {id: id}, (err, data) =>{
      for(var i in data) {
        if (data[i].img != '' && data[i].img != null) {
          if(data[i].img.indexOf('https') == -1) {
            data[i].img = app.globalData.https + data[i].img
          }
        } else {
          data[i].img = '/image/default_head.png'
        }
      }
      that.setData({
        listData: data
      })
    },'GET','home')
  },
  /*
   * 查看
   */
  showLookPop: function(e) {
    var arr = []
    var sex = ['保密','男','女']
    var index = e.currentTarget.dataset.index
    for(var i in this.data.list) {
      var obj = {}
      obj['key'] = this.data.list[i]
      if(i=='sex') {
        obj['val'] = sex[this.data.listData[index][i]]
      } else {
        obj['val'] = this.data.listData[index][i]
      }
      arr.push(obj)
    }
    this.setData({
      isPop: true,
      listArr: arr
    })
  },
  /* 
   * 关闭弹窗
   */
  closePop: function() {
    this.setData({
      isPop: false
    })
  }
})
